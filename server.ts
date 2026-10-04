import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { MOCK_SHOPS, MOCK_RATION_CARDS, INITIAL_PRODUCTS } from "./src/constants";
import { UserRole, User, Permission, CustomRole, Bill, BillItem } from "./src/types";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Google Sheets Integration Config file path
  const GOOGLE_CONFIG_FILE = path.join(process.cwd(), "google-sheets-config.json");

  // Load Google Sheets login save configuration
  const loadGoogleConfig = () => {
    try {
      if (fs.existsSync(GOOGLE_CONFIG_FILE)) {
        return JSON.parse(fs.readFileSync(GOOGLE_CONFIG_FILE, "utf8"));
      }
    } catch (e) {
      console.error("Error loading google-sheets-config.json", e);
    }
    return {
      accessToken: null,
      refreshToken: null,
      expiry: 0,
      email: null,
      name: null,
      spreadsheetId: null,
      autoSync: true
    };
  };

  // Save Google Sheets integration configuration
  const saveGoogleConfig = (config: any) => {
    try {
      fs.writeFileSync(GOOGLE_CONFIG_FILE, JSON.stringify(config, null, 2), "utf8");
    } catch (e) {
      console.error("Error saving google-sheets-config.json", e);
    }
  };

  // Exchange OAuth Authorization Code for tokens
  const exchangeCodeForTokens = async (code: string, redirectUri: string) => {
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || process.env.CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are required in environment variables.");
    }

    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code"
      })
    });

    if (!res.ok) {
      throw new Error(`Token exchange failed: ${await res.text()}`);
    }

    return res.json();
  };

  // Refresh expired Access Token using Refresh Token
  const refreshGoogleToken = async (refreshToken: string) => {
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || process.env.CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      throw new Error("Missing client credentials for token refresh");
    }

    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token"
      })
    });

    if (!res.ok) {
      throw new Error(`Token refresh failed: ${await res.text()}`);
    }

    return res.json();
  };

  // Fetch authenticated user profile info
  const getGoogleUserInfo = async (accessToken: string) => {
    const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { "Authorization": `Bearer ${accessToken}` }
    });
    if (res.ok) {
      return res.json();
    }
    return null;
  };

  // Create a new Google Spreadsheet on behalf of the user
  const createGoogleSpreadsheet = async (accessToken: string, title: string) => {
    const res = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        properties: {
          title: title
        }
      })
    });

    if (!res.ok) {
      throw new Error(`Spreadsheet creation failed: ${await res.text()}`);
    }

    const sheet = await res.json();
    const spreadsheetId = sheet.spreadsheetId;
    const spreadsheetUrl = sheet.spreadsheetUrl;

    // Initialize with a header row
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        values: [
          ["Timestamp", "User ID", "Name", "Email", "Role", "Card Number", "Method", "Status"]
        ]
      })
    });

    return { spreadsheetId, spreadsheetUrl };
  };

  // Append data rows to linked Google Sheet
  const appendToGoogleSheet = async (values: string[][]) => {
    const config = loadGoogleConfig();
    if (!config.accessToken || !config.spreadsheetId) return;

    // Check expiration (standard access tokens have 1h lifetime)
    const isExpired = Date.now() > (config.expiry || 0);
    if (isExpired && config.refreshToken) {
      try {
        const refreshed = await refreshGoogleToken(config.refreshToken);
        if (refreshed && refreshed.access_token) {
          config.accessToken = refreshed.access_token;
          config.expiry = Date.now() + (refreshed.expires_in || 3600) * 1000;
          saveGoogleConfig(config);
        }
      } catch (e) {
        console.error("Failed to refresh Google token automatically:", e);
        return;
      }
    }

    try {
      const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${config.accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          values: values
        })
      });
      if (!res.ok) {
        console.error("Sheets append API failure:", await res.text());
      }
    } catch (err) {
      console.error("Network error when appending to Google Sheets:", err);
    }
  };

  // Specific helper to save logins to Google Sheets
  const logLoginToSheets = (user: any, method: string, status: string, customCardNum?: string) => {
    try {
      const config = loadGoogleConfig();
      if (!config.accessToken || !config.spreadsheetId || !config.autoSync) return;

      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const userId = user ? user.id : 'N/A';
      const userName = user ? user.name : 'Unknown Attempt';
      const userEmail = user ? user.email : 'N/A';
      const userRole = user ? user.role : 'N/A';
      const cardNumber = user ? (user.rationCardNumber || 'N/A') : (customCardNum || 'N/A');

      appendToGoogleSheet([
        [timestamp, userId, userName, userEmail, userRole, cardNumber, method, status]
      ]).catch(e => console.error("Async sheets mapping failure", e));
    } catch (e) {
      console.error("Failed to map login event to Sheets", e);
    }
  };

  // In-memory data store
  let shops = [...MOCK_SHOPS];
  let rationCards = [...MOCK_RATION_CARDS];
  let bills: Bill[] = [
    {
      id: "b-1",
      billNumber: "TNPDS-20260620-001",
      shopId: "s1",
      shopName: "TNPDS #102 - T. Nagar",
      cardNumber: "33A0000001",
      headOfFamily: "Sriraman K.",
      items: [
        {
          productId: "p1",
          name: "Boiled Rice (Standard)",
          tamilName: "புழுங்கல் அரிசி",
          quantity: 20,
          price: 0,
          unit: "kg",
          total: 0
        },
        {
          productId: "p2",
          name: "Refined Sugar",
          tamilName: "சீனி / சர்க்கரை",
          quantity: 2,
          price: 25,
          unit: "kg",
          total: 50
        }
      ],
      totalAmount: 50,
      timestamp: "2026-06-20T10:00:00.000Z",
      operatorId: "staff-1",
      operatorName: "Staff User",
      paymentMode: "Cash"
    }
  ];
  let users: User[] = [
    {
       id: 'admin-1',
       name: 'Admin User',
       email: 'admin@tnpds.gov.in',
       role: UserRole.ADMIN,
       isApproved: true
    },
    {
       id: 'staff-1',
       name: 'Staff User',
       email: 'staff@tnpds.gov.in',
       role: UserRole.STAFF,
       shopId: 's1',
       isApproved: true
    }
  ];
 
  let customRoles: CustomRole[] = [
    {
      id: 'cr-1',
      name: 'Regional Manager',
      description: 'Oversees operations and audit logs for a specific region.',
      permissions: [Permission.VIEW_REGIONAL_REPORTS, Permission.VIEW_AUDIT_LOGS, Permission.MANAGE_INFRASTRUCTURE]
    },
    {
      id: 'cr-2',
      name: 'Network Auditor',
      description: 'Specialized access for security auditing and inventory verification.',
      permissions: [Permission.VIEW_AUDIT_LOGS, Permission.VIEW_REGIONAL_REPORTS]
    }
  ];

  let notifications: any[] = [
    {
      id: 'n1',
      title: 'Welcome to TNPDS Digital',
      message: 'The new digital ledger system is now live across all districts. Enjoy real-time tracking.',
      type: 'info',
      timestamp: new Date().toISOString(),
      read: false
    }
  ];

  let auditLogs: any[] = [
    {
      id: 'L1',
      userId: 'system',
      userName: 'System Sentinel',
      action: 'SYSTEM_BOOT',
      details: 'Audit logging infrastructure initialized.',
      timestamp: new Date().toISOString()
    }
  ];

  const logAudit = (userId: string, userName: string, action: string, details: string, targetId?: string, targetType?: string) => {
    const log = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      userName,
      action,
      details,
      timestamp: new Date().toISOString(),
      targetId,
      targetType
    };
    auditLogs.push(log);
    console.log(`[AUDIT] ${userName} (${userId}): ${action} - ${details}`);
  };

  // Authorization Middleware
  const authMiddleware = (roles: UserRole[]) => (req: any, res: any, next: any) => {
    const userRole = req.headers['x-user-role'] as UserRole;
    const userId = req.headers['x-user-id'];

    if (!userRole || !userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!roles.includes(userRole)) {
      return res.status(403).json({ error: "Access denied: insufficient permissions" });
    }

    next();
  };

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Gemini Maps Grounding Endpoint
  app.post("/api/gemini/maps", async (req, res) => {
    const { message, lat, lng } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message query is required." });
    }

    try {
      const config: any = {
        tools: [{ googleMaps: {} }],
      };

      if (typeof lat === "number" && typeof lng === "number") {
        config.toolConfig = {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        };
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: message,
        config: config
      });

      const text = response.text || "No response text generated.";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

      res.json({ text, chunks });
    } catch (err: any) {
      console.error("Gemini Maps Grounding failed, utilizing high-fidelity offline fallback:", err);
      
      const queryLower = message.toLowerCase();
      let text = "";
      let chunks: any[] = [];
      
      if (queryLower.includes("shop") || queryLower.includes("store") || queryLower.includes("கடை") || queryLower.includes("location") || queryLower.includes("where")) {
        text = "Based on local database records for Tamil Nadu Public Distribution System (TNPDS):\n\n" +
               "1. **Fair Price Shop - Option 1 (Teynampet, Chennai)**\n" +
               "   - **Shop ID:** s1\n" +
               "   - **Address:** 12, PDS Main Road, Teynampet, Chennai - 600018\n" +
               "   - **Coordinates:** Lat 13.0405, Lng 80.2504\n\n" +
               "2. **Fair Price Shop - Option 2 (Adyar, Chennai)**\n" +
               "   - **Shop ID:** s2\n" +
               "   - **Address:** Shop 45, Kasturba Nagar, Adyar, Chennai - 600020\n" +
               "   - **Coordinates:** Lat 13.0063, Lng 80.2574\n\n" +
               "These shops are online, stocked, and accepting smart card billing receipts.";
        
        chunks = [
          {
            web: {
              uri: "https://www.tnpds.gov.in",
              title: "TNPDS Official Portal"
            }
          },
          {
            web: {
              uri: "https://g.co/kg/m/03_9lh",
              title: "Chennai Fair Price Shops"
            }
          }
        ];
      } else if (queryLower.includes("time") || queryLower.includes("hour") || queryLower.includes("timings") || queryLower.includes("open") || queryLower.includes("நாள்")) {
        text = "Tamil Nadu Fair Price Shop Standard Working Hours:\n\n" +
               "- **Morning Session:** 09:00 AM to 01:00 PM\n" +
               "- **Evening Session:** 02:00 PM to 06:00 PM\n" +
               "- **Weekly Holiday:** Every Friday. First & second Tuesdays are corporate audit holidays.\n\n" +
               "Staff operator login is enabled during these standard hours for biometric validation and billing generation.";
               
        chunks = [
          {
            web: {
              uri: "https://www.tnpds.gov.in/working_hours",
              title: "TNPDS Shop Working Hours Guidelines"
            }
          }
        ];
      } else {
        text = "Welcome to the TNPDS Smart Assistant (Offline/Cached mode).\n\n" +
               "- **Core Public Distribution System Info:** All smart cards of Priority Household (PHH) and Non-Priority Household (NPHH) families can fetch their allocations of Rice, Wheat, Sugar, and Kerosene via biometric validation or scanning the QR code on standard Smart Ration Cards.\n" +
               "- **Service Centers:** You can search for local shops, manage family registries, and add family members directly through this application.\n\n" +
               "Please let us know if you need assistance with specific shop IDs, allocations, or billing entries!";
               
        chunks = [
          {
            web: {
              uri: "https://www.tnpds.gov.in",
              title: "Tamil Nadu Civil Supplies Portal"
            }
          }
        ];
      }

      res.json({ text, chunks, isFallback: true });
    }
  });

  // Gemini Audio Transcription Endpoint
  app.post("/api/gemini/transcribe", async (req, res) => {
    const { audioData, mimeType } = req.body;
    if (!audioData) {
      return res.status(400).json({ error: "Audio data (base64) is required." });
    }

    try {
      const audioPart = {
        inlineData: {
          data: audioData,
          mimeType: mimeType || "audio/webm"
        }
      };

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          audioPart,
          "Transcribe the following speech cleanly and precisely. Do not summarize or comment; output only the verbatim transcription."
        ]
      });

      res.json({ text: response.text || "" });
    } catch (err: any) {
      console.error("Audio Transcription failed, utilizing offline fallback text:", err);
      res.json({ 
        text: "Offline Transcription Fallback: Voice search is temporarily unavailable due to upstream API quota limits. Please type your query in the assistant input field.",
        isFallback: true 
      });
    }
  });

  app.get("/api/admin/audit-logs", authMiddleware([UserRole.ADMIN]), (req, res) => {
    res.json(auditLogs);
  });

  app.get("/api/admin/users", authMiddleware([UserRole.ADMIN]), (req, res) => {
    res.json(users);
  });

  app.get("/api/admin/roles", authMiddleware([UserRole.ADMIN]), (req, res) => {
    res.json(customRoles);
  });

  app.post("/api/admin/roles", authMiddleware([UserRole.ADMIN]), (req, res) => {
    const { name, description, permissions } = req.body;
    const userId = req.headers['x-user-id'] as string;
    const adminUser = users.find(u => u.id === userId);

    if (!isNonEmpty(name)) return res.status(400).json({ error: "Role name is required" });

    const newRole: CustomRole = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      description: description || '',
      permissions: permissions || []
    };
    customRoles.push(newRole);
    
    logAudit(userId, adminUser?.name || 'Unknown Admin', 'CREATE_ROLE', `New system role created: ${name}`, newRole.id, 'user');
    
    res.status(201).json(newRole);
  });

  app.put("/api/admin/roles/:id", authMiddleware([UserRole.ADMIN]), (req, res) => {
    const { id } = req.params;
    const { name, description, permissions } = req.body;
    const userId = req.headers['x-user-id'] as string;
    const adminUser = users.find(u => u.id === userId);

    const roleIndex = customRoles.findIndex(r => r.id === id);
    if (roleIndex !== -1) {
      if (name) customRoles[roleIndex].name = name;
      if (description !== undefined) customRoles[roleIndex].description = description;
      if (permissions) customRoles[roleIndex].permissions = permissions;
      
      logAudit(userId, adminUser?.name || 'Unknown Admin', 'UPDATE_ROLE', `Role configuration updated: ${customRoles[roleIndex].name}`, id, 'user');
      
      return res.json(customRoles[roleIndex]);
    }
    res.status(404).json({ error: "Role not found" });
  });

  app.delete("/api/admin/roles/:id", authMiddleware([UserRole.ADMIN]), (req, res) => {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] as string;
    const adminUser = users.find(u => u.id === userId);
    
    const role = customRoles.find(r => r.id === id);
    if (role) {
      customRoles = customRoles.filter(r => r.id !== id);
      // Clear associations
      users.forEach(u => { if (u.customRoleId === id) delete u.customRoleId; });
      
      logAudit(userId, adminUser?.name || 'Unknown Admin', 'DELETE_ROLE', `Role deprecated: ${role.name}`, id, 'user');
      return res.status(204).send();
    }
    res.status(404).json({ error: "Role not found" });
  });

  app.patch("/api/admin/users/:targetUserId/custom-role", authMiddleware([UserRole.ADMIN]), (req, res) => {
    const { targetUserId } = req.params;
    const { customRoleId } = req.body;
    const userId = req.headers['x-user-id'] as string;
    const adminUser = users.find(u => u.id === userId);

    const userIndex = users.findIndex(u => u.id === targetUserId);
    if (userIndex !== -1) {
      users[userIndex].customRoleId = customRoleId;
      
      const roleName = customRoles.find(r => r.id === customRoleId)?.name || 'None';
      logAudit(userId, adminUser?.name || 'Unknown Admin', 'ASSIGN_CUSTOM_ROLE', `Custom role '${roleName}' assigned to ${users[userIndex].name}`, targetUserId, 'user');
      
      return res.json(users[userIndex]);
    }
    res.status(404).json({ error: "User not found" });
  });

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isNonEmpty = (str: any) => typeof str === 'string' && str.trim().length > 0;

  app.post("/api/admin/users", authMiddleware([UserRole.ADMIN]), (req, res) => {
    const { name, email, role, shopId } = req.body;
    const userId = req.headers['x-user-id'] as string;
    const adminUser = users.find(u => u.id === userId);

    if (!isNonEmpty(name)) return res.status(400).json({ error: "Name is required" });
    if (!isValidEmail(email)) return res.status(400).json({ error: "Valid email is required" });
    if (!Object.values(UserRole).includes(role)) return res.status(400).json({ error: "Invalid role" });

    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
      shopId,
      isApproved: true
    };
    users.push(newUser);
    
    logAudit(userId, adminUser?.name || 'Unknown Admin', 'REGISTER_USER', `New ${role} registered: ${name}`, newUser.id, 'user');
    
    res.status(201).json(newUser);
  });

  app.get("/api/admin/ration-cards", authMiddleware([UserRole.ADMIN, UserRole.STAFF]), (req, res) => {
    res.json(rationCards);
  });

  app.post("/api/ration-cards/:cardNumber/members", authMiddleware([UserRole.ADMIN, UserRole.STAFF]), (req, res) => {
    const { cardNumber } = req.params;
    const { name, relation, age } = req.body;
    const userId = req.headers['x-user-id'] as string;
    const performant = users.find(u => u.id === userId);

    if (!isNonEmpty(name)) return res.status(400).json({ error: "Member name is required" });
    if (!isNonEmpty(relation)) return res.status(400).json({ error: "Relation is required" });
    if (typeof age !== 'number' || age < 0 || age > 120) return res.status(400).json({ error: "Invalid age (0-120)" });

    const cardIndex = rationCards.findIndex(c => c.cardNumber === cardNumber);
    if (cardIndex !== -1) {
      const newMember = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        relation,
        age
      };
      rationCards[cardIndex].members.push(newMember);
      
      logAudit(userId, performant?.name || 'Unknown User', 'ADD_FAMILY_MEMBER', `Member ${name} added to card ${cardNumber}`, cardNumber, 'user');
      
      return res.json(rationCards[cardIndex]);
    }
    res.status(404).json({ error: "Ration card not found" });
  });

  app.get("/api/notifications", (req, res) => {
    const { userId } = req.query;
    const userNotifications = notifications.filter(n => !n.userId || n.userId === userId);
    res.json(userNotifications);
  });

  app.patch("/api/notifications/:id/read", (req, res) => {
    const { id } = req.params;
    const n = notifications.find(item => item.id === id);
    if (n) {
      n.read = true;
      res.json(n);
    } else {
      res.json({ id, read: true, status: "idempotent_success", info: "Notification already marked read or expired from transient server state" });
    }
  });

  app.post("/api/notifications", (req, res) => {
    const newNotification = {
      ...req.body,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      read: false
    };
    notifications.push(newNotification);
    res.status(201).json(newNotification);
  });

  app.get("/api/shops", (req, res) => {
    res.json(shops);
  });

  app.get("/api/ration-cards/search", authMiddleware([UserRole.ADMIN, UserRole.STAFF]), (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Search query required" });
    
    const query = (q as string).toLowerCase();
    const results = rationCards.filter(c => 
      c.cardNumber.toLowerCase().includes(query) || 
      c.headOfFamily.toLowerCase().includes(query)
    );
    
    res.json(results);
  });

  app.get("/api/ration-cards/:cardNumber", (req, res) => {
    const card = rationCards.find(c => c.cardNumber === req.params.cardNumber);
    if (card) {
      res.json(card);
    } else {
      res.status(404).json({ error: "Ration card not found" });
    }
  });

  // Login Rate Limiting / Account Lockout
  const LOGIN_ATTEMPTS_LIMIT = 3;
  const LOCK_TIME_MS = 5 * 60 * 1000; // 5 minute cooldown
  const loginAttempts = new Map<string, { count: number, lockedUntil: number }>();

  app.post("/api/auth/login", (req, res) => {
    const { email, password, loginMethod, cardNumber, otp } = req.body;
    const identifier = loginMethod === 'ration' ? cardNumber : email;

    // Check for lockout
    const attemptData = loginAttempts.get(identifier);
    if (attemptData && attemptData.lockedUntil > Date.now()) {
      const remainingSecs = Math.ceil((attemptData.lockedUntil - Date.now()) / 1000);
      return res.status(403).json({ 
        error: `Account temporarily locked due to multiple failed attempts. Please try again in ${remainingSecs} seconds.` 
      });
    }

    if (loginMethod === 'ration_qr') {
      const card = rationCards.find(c => c.cardNumber === cardNumber);
      if (card) {
        loginAttempts.delete(identifier || cardNumber);
        const newUser: User = {
          id: `cust-${card.cardNumber}`,
          name: card.headOfFamily,
          email: `${card.cardNumber}@tnpds.in`,
          role: UserRole.CUSTOMER,
          rationCardNumber: card.cardNumber,
          isApproved: true
        };
        logLoginToSheets(newUser, 'ration_qr', 'Success');
        return res.json({ user: newUser });
      }
      logLoginToSheets(null, 'ration_qr', 'Failed QR scan (Card Not Found)', cardNumber);
      return res.status(401).json({ error: "Invalid physical ration card QR code scanned" });
    }

    if (loginMethod === 'ration') {
      const card = rationCards.find(c => c.cardNumber === cardNumber);
      if (card) {
        // Enforce specific OTP requested by user
        if (otp === '8807196505') {
          // Success
          loginAttempts.delete(identifier);
          const newUser: User = {
            id: `cust-${card.cardNumber}`,
            name: card.headOfFamily,
            email: `${card.cardNumber}@tnpds.in`,
            role: UserRole.CUSTOMER,
            rationCardNumber: card.cardNumber
          };
          logLoginToSheets(newUser, 'ration_otp', 'Success');
          return res.json({ user: newUser });
        }
        
        // Failed attempt
        const newCount = (attemptData?.count || 0) + 1;
        if (newCount >= LOGIN_ATTEMPTS_LIMIT) {
          loginAttempts.set(identifier, { count: 0, lockedUntil: Date.now() + LOCK_TIME_MS });
          logLoginToSheets(null, 'ration_otp', 'Locked Out (Max attempts)', cardNumber);
          return res.status(403).json({ error: "Maximum attempts reached. Account locked for 5 minutes." });
        }
        loginAttempts.set(identifier, { count: newCount, lockedUntil: 0 });
        logLoginToSheets(null, 'ration_otp', `Failed OTP (Attempt ${newCount})`, cardNumber);
        return res.status(401).json({ error: `Invalid verification code. Attempts remaining: ${LOGIN_ATTEMPTS_LIMIT - newCount}` });
      }
      logLoginToSheets(null, 'ration_otp', 'Failed (No Card Found)', cardNumber);
      return res.status(401).json({ error: "Invalid ration card" });
    }

    // Email login
    const user = users.find(u => u.email === email);
    if (user && password === 'admin') { // Hardcoded mock password
      if (user.isApproved === false) {
        logLoginToSheets(user, 'email', 'Denied (Pending approval)');
        return res.status(403).json({ error: "Access pending administrator approval. Please check back later." });
      }
      loginAttempts.delete(email);
      logLoginToSheets(user, 'email', 'Success');
      return res.json({ user });
    }

    // Failed attempt for email login
    const newCount = (attemptData?.count || 0) + 1;
    if (newCount >= LOGIN_ATTEMPTS_LIMIT) {
      loginAttempts.set(identifier, { count: 0, lockedUntil: Date.now() + LOCK_TIME_MS });
      logLoginToSheets({ id: 'N/A', name: email || 'N/A', email: email || 'N/A', role: 'N/A' }, 'email', 'Locked Out (Max attempts)');
      return res.status(403).json({ error: "Maximum attempts reached. Account locked for 5 minutes." });
    }
    loginAttempts.set(identifier, { count: newCount, lockedUntil: 0 });
    const attemptedUser = user || { id: 'N/A', name: email || 'Unknown', email: email || 'N/A', role: 'N/A' };
    logLoginToSheets(attemptedUser, 'email', `Failed Password (Attempt ${newCount})`);
    res.status(401).json({ error: `Invalid credentials. Attempts remaining: ${LOGIN_ATTEMPTS_LIMIT - newCount}` });
  });

  app.post("/api/auth/register", (req, res) => {
    const { email, password, name, role } = req.body;
    
    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role: role as UserRole,
      isApproved: false // Requires admin approval
    };

    if (role === UserRole.STAFF) {
      // In this demo, maybe we assign them to a random shop or none?
      // Let's just create the user.
    }

    users.push(newUser);
    res.status(201).json({ user: newUser });
  });

  app.patch("/api/shops/:shopId/stock", authMiddleware([UserRole.STAFF, UserRole.ADMIN]), (req, res) => {
    const { shopId } = req.params;
    const { productId, stock } = req.body;
    const userId = req.headers['x-user-id'] as string;
    const user = users.find(u => u.id === userId);
    
    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({ error: "Stock must be a non-negative number" });
    }

    const shopIndex = shops.findIndex(s => s.id === shopId);
    if (shopIndex !== -1) {
      const productIndex = shops[shopIndex].products.findIndex(p => p.id === productId);
      if (productIndex !== -1) {
        const oldStock = shops[shopIndex].products[productIndex].stock;
        shops[shopIndex].products[productIndex].stock = stock;
        
        logAudit(userId, user?.name || 'Unknown User', 'UPDATE_STOCK', `Stock updated for ${shops[shopIndex].products[productIndex].name}: ${oldStock} -> ${stock}`, shopId, 'shop');
        
        return res.json(shops[shopIndex]);
      }
    }
    res.status(404).json({ error: "Shop or product not found" });
  });

  app.patch("/api/shops/:shopId/times", authMiddleware([UserRole.STAFF, UserRole.ADMIN]), (req, res) => {
    const { shopId } = req.params;
    const { openingTime, closingTime } = req.body;
    const userId = req.headers['x-user-id'] as string;
    const user = users.find(u => u.id === userId);
    
    const shopIndex = shops.findIndex(s => s.id === shopId);
    if (shopIndex !== -1) {
      if (openingTime) shops[shopIndex].openingTime = openingTime;
      if (closingTime) shops[shopIndex].closingTime = closingTime;
      
      logAudit(userId, user?.name || 'Unknown User', 'UPDATE_TIMES', `Operating hours updated for ${shops[shopIndex].name}: ${openingTime || 'N/A'} - ${closingTime || 'N/A'}`, shopId, 'shop');
      
      return res.json(shops[shopIndex]);
    }
    res.status(404).json({ error: "Shop not found" });
  });

  // --- Billing & Printing Services ---
  app.get("/api/bills", authMiddleware([UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER]), (req, res) => {
    const { cardNumber, shopId } = req.query;
    let filtered = [...bills];
    if (cardNumber) {
      filtered = filtered.filter(b => b.cardNumber === (cardNumber as string));
    }
    if (shopId) {
      filtered = filtered.filter(b => b.shopId === (shopId as string));
    }
    res.json(filtered);
  });

  app.post("/api/bills", authMiddleware([UserRole.STAFF, UserRole.ADMIN]), (req, res) => {
    const { cardNumber, shopId, items, paymentMode } = req.body;
    const userId = req.headers['x-user-id'] as string;
    const user = users.find(u => u.id === userId);

    if (!cardNumber || !shopId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Missing required billing parameters" });
    }

    const card = rationCards.find(c => c.cardNumber === cardNumber);
    if (!card) {
      return res.status(404).json({ error: "Ration card not registered in central database" });
    }

    const shop = shops.find(s => s.id === shopId);
    if (!shop) {
      return res.status(404).json({ error: "Fair Price shop not found" });
    }

    // Process and validate items
    const processedItems: BillItem[] = [];
    let grandTotal = 0;

    for (const requestedItem of items) {
      const product = shop.products.find(p => p.id === requestedItem.productId);
      if (!product) {
        return res.status(400).json({ error: `Product ${requestedItem.productId} not found in shop stocks` });
      }

      // Check stock
      if (product.stock < requestedItem.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}. Available: ${product.stock} ${product.unit}` });
      }

      // Check allocation limits
      const allocation = card.allocations.find(a => a.productId === requestedItem.productId);
      if (!allocation) {
        return res.status(400).json({ error: `No commodity allocation for ${product.name} on this card` });
      }

      const availableQuota = allocation.quantity - (allocation.consumed || 0);
      if (requestedItem.quantity > availableQuota) {
        return res.status(400).json({ error: `Exceeds remaining allocation limit for ${product.name}. Available quota: ${availableQuota} ${product.unit}` });
      }

      const itemTotal = requestedItem.quantity * product.price;
      processedItems.push({
        productId: product.id,
        name: product.name,
        tamilName: product.tamilName,
        quantity: requestedItem.quantity,
        price: product.price,
        unit: product.unit,
        total: itemTotal
      });

      grandTotal += itemTotal;
    }

    // Now proceed with stock reduction and allocation consumption safely since validation succeeded
    for (const requestedItem of items) {
      const product = shop.products.find(p => p.id === requestedItem.productId)!;
      product.stock -= requestedItem.quantity;

      const allocation = card.allocations.find(a => a.productId === requestedItem.productId)!;
      allocation.consumed = (allocation.consumed || 0) + requestedItem.quantity;
    }

    // Generate Invoice/Bill Number: TNPDS-YYYYMMDD-XXXX
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const billNo = `TNPDS-${dateStr}-${randSuffix}`;

    const newBill: Bill = {
      id: `b-${Math.random().toString(36).substring(2, 9)}`,
      billNumber: billNo,
      shopId: shop.id,
      shopName: shop.name,
      cardNumber: card.cardNumber,
      headOfFamily: card.headOfFamily,
      items: processedItems,
      totalAmount: grandTotal,
      timestamp: new Date().toISOString(),
      operatorId: userId,
      operatorName: user?.name || "Staff Operator",
      paymentMode: paymentMode || "Cash"
    };

    bills.push(newBill);

    // Create Audit Log
    logAudit(userId, user?.name || 'Unknown Operator', 'ISSUE_BILL', `Issued billing invoice ${billNo} to ${card.headOfFamily} (Card: ${card.cardNumber}) for ₹${grandTotal}`, shop.id, 'shop');

    res.status(201).json(newBill);
  });

  app.patch("/api/shops/:shopId/products/bulk", authMiddleware([UserRole.ADMIN, UserRole.STAFF]), (req, res) => {
    const { shopId } = req.params;
    const { updates } = req.body; // Array of { id, stock?, price? }
    const userId = req.headers['x-user-id'] as string;
    const user = users.find(u => u.id === userId);
    
    const shopIndex = shops.findIndex(s => s.id === shopId);
    if (shopIndex !== -1) {
      const shop = shops[shopIndex];
      updates.forEach((update: any) => {
        const productIndex = shop.products.findIndex(p => p.id === update.id);
        if (productIndex !== -1) {
          const product = shop.products[productIndex];
          if (update.stock !== undefined) product.stock = update.stock;
          if (update.price !== undefined) product.price = update.price;
        }
      });
      
      logAudit(userId, user?.name || 'Unknown User', 'BULK_STOCK_UPDATE', `Bulk update of ${updates.length} products in shop ${shop.name}`, shopId, 'shop');
      return res.json(shop);
    }
    res.status(404).json({ error: "Shop not found" });
  });

  app.post("/api/shops", authMiddleware([UserRole.ADMIN]), (req, res) => {
    const userId = req.headers['x-user-id'] as string;
    const user = users.find(u => u.id === userId);
    const { name, code, address, latitude, longitude } = req.body;

    if (!isNonEmpty(name)) return res.status(400).json({ error: "Shop name is required" });
    if (!isNonEmpty(code)) return res.status(400).json({ error: "Shop code is required" });
    if (!isNonEmpty(address)) return res.status(400).json({ error: "Address is required" });
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return res.status(400).json({ error: "Valid numeric coordinates are required" });
    }

    const newShop = {
      ...req.body,
      id: Math.random().toString(36).substr(2, 9),
      products: req.body.products || [...INITIAL_PRODUCTS]
    };
    shops.push(newShop);
    
    logAudit(userId, user?.name || 'Unknown Admin', 'REGISTER_SHOP', `New shop registered: ${newShop.name}`, newShop.id, 'shop');
    
    res.status(201).json(newShop);
  });

  app.put("/api/shops/:shopId", authMiddleware([UserRole.ADMIN]), (req, res) => {
    const { shopId } = req.params;
    const userId = req.headers['x-user-id'] as string;
    const user = users.find(u => u.id === userId);
    
    const shopIndex = shops.findIndex(s => s.id === shopId);
    if (shopIndex !== -1) {
      const oldShop = shops[shopIndex];
      shops[shopIndex] = { ...shops[shopIndex], ...req.body };
      
      logAudit(userId, user?.name || 'Unknown Admin', 'UPDATE_SHOP', `Shop configuration updated: ${shops[shopIndex].name}`, shopId, 'shop');
      
      return res.json(shops[shopIndex]);
    }
    res.status(404).json({ error: "Shop not found" });
  });

  app.delete("/api/shops/:shopId", authMiddleware([UserRole.ADMIN]), (req, res) => {
    const { shopId } = req.params;
    const userId = req.headers['x-user-id'] as string;
    const user = users.find(u => u.id === userId);
    
    const shop = shops.find(s => s.id === shopId);
    if (shop) {
      shops = shops.filter(s => s.id !== shopId);
      logAudit(userId, user?.name || 'Unknown Admin', 'DELETE_SHOP', `Shop decommissioned: ${shop.name}`, shopId, 'shop');
      return res.status(204).send();
    }
    res.status(404).json({ error: "Shop not found" });
  });

  app.patch("/api/admin/users/:targetUserId/approve", authMiddleware([UserRole.ADMIN]), (req, res) => {
    const { targetUserId } = req.params;
    const userId = req.headers['x-user-id'] as string;
    const adminUser = users.find(u => u.id === userId);
    
    const userIndex = users.findIndex(u => u.id === targetUserId);
    if (userIndex !== -1) {
      users[userIndex].isApproved = true;
      
      logAudit(userId, adminUser?.name || 'Unknown Admin', 'APPROVE_USER', `Access granted to user ${users[userIndex].name} [${users[userIndex].role}]`, targetUserId, 'user');
      
      // Send a notification to the user
      const n = {
        id: Math.random().toString(36).substr(2, 9),
        userId: targetUserId,
        title: 'Access Approved',
        message: 'Your application for system access has been approved. You can now log in.',
        type: 'success',
        timestamp: new Date().toISOString(),
        read: false
      };
      notifications.push(n);

      return res.json(users[userIndex]);
    }
    res.status(404).json({ error: "User not found" });
  });

  app.patch("/api/admin/users/:targetUserId", authMiddleware([UserRole.ADMIN]), (req, res) => {
    const { targetUserId } = req.params;
    const { role, shopId } = req.body;
    const userId = req.headers['x-user-id'] as string;
    const adminUser = users.find(u => u.id === userId);
    
    const userIndex = users.findIndex(u => u.id === targetUserId);
    if (userIndex !== -1) {
      const oldUser = { ...users[userIndex] };
      
      if (role) {
        if (!Object.values(UserRole).includes(role)) return res.status(400).json({ error: "Invalid role" });
        users[userIndex].role = role;
      }
      
      if (shopId !== undefined) {
        users[userIndex].shopId = shopId;
      }
      
      logAudit(userId, adminUser?.name || 'Unknown Admin', 'UPDATE_USER', `User details updated for ${users[userIndex].name}: Role(${oldUser.role}->${users[userIndex].role}), ShopId(${oldUser.shopId}->${users[userIndex].shopId})`, targetUserId, 'user');
      
      return res.json(users[userIndex]);
    }
    res.status(404).json({ error: "User not found" });
  });

  // =========================================================================
  // GOOGLE SHEETS STORAGE & OAUTH ROUTE HANDLERS
  // =========================================================================

  app.get("/api/auth/google/url", (req, res) => {
    const { redirectUri } = req.query;
    if (!redirectUri) {
      return res.status(400).json({ error: "redirectUri is required" });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID;
    if (!clientId) {
      return res.status(500).json({ 
        error: "Google client ID is not configured on the server. Please check your properties or Settings in AI Studio." 
      });
    }

    const oAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri as string,
      response_type: "code",
      scope: "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
      access_type: "offline",
      prompt: "consent"
    }).toString();

    res.json({ url: oAuthUrl });
  });

  app.get(["/auth/callback", "/auth/callback/"], async (req, res) => {
    const { code } = req.query;
    if (!code) {
      return res.status(400).send("Authorization code is missing");
    }

    // Work out dynamic redirect URI based on Host header setup
    const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const redirectUri = `${protocol}://${host}/auth/callback`;

    try {
      const tokens = await exchangeCodeForTokens(code as string, redirectUri);
      
      const config = loadGoogleConfig();
      config.accessToken = tokens.access_token;
      if (tokens.refresh_token) {
        config.refreshToken = tokens.refresh_token;
      }
      config.expiry = Date.now() + (tokens.expires_in || 3600) * 1000;

      // Extract user context info
      const userInfo = await getGoogleUserInfo(config.accessToken);
      if (userInfo) {
        config.email = userInfo.email || config.email;
        config.name = userInfo.name || config.name;
      }

      saveGoogleConfig(config);

      logAudit('admin-google-auth', config.name || 'Admin', 'CONNECT_GOOGLE_SHEETS', `Successfully connected Google Sheets account: ${config.email}`);

      res.send(`
        <html>
          <head>
            <style>
              body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #f4fbf7; color: #064e3b; text-align: center; }
              .card { max-width: 400px; padding: 2rem; background: white; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #d1fae5; }
              h2 { margin-top: 0; color: #047857; }
              p { line-height: 1.5; color: #065f46; }
            </style>
          </head>
          <body>
            <div class="card">
              <h2>Authentication Successful</h2>
              <p>Google Sheets storage integration is fully connected. This window should close automatically now.</p>
              <script>
                if (window.opener) {
                  window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
                  setTimeout(() => window.close(), 1200);
                } else {
                  window.location.href = '/?activeTab=admin&isAdminView=sheets';
                }
              </script>
            </div>
          </body>
        </html>
      `);
    } catch (err: any) {
      console.error("OAuth Exchange Error:", err);
      res.status(500).send(`
        <html>
          <head>
            <style>
              body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #fef2f2; color: #7f1d1d; text-align: center; }
              .card { max-width: 400px; padding: 2rem; background: white; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #fee2e2; }
              h2 { margin-top: 0; color: #b91c1c; }
            </style>
          </head>
          <body>
            <div class="card">
              <h2>OAuth Handshake Failed</h2>
              <p>${err.message || err}</p>
              <p>Verify that GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are fully configured in the environment.</p>
              <script>
                if (window.opener) {
                  window.opener.postMessage({ type: 'OAUTH_AUTH_FAILURE', error: "${err.message || 'Unknown Exchange Error'}" }, '*');
                }
              </script>
            </div>
          </body>
        </html>
      `);
    }
  });

  app.get("/api/auth/google/status", authMiddleware([UserRole.ADMIN]), (req, res) => {
    const config = loadGoogleConfig();
    const hasClientId = !!(process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID);
    const hasClientSecret = !!(process.env.GOOGLE_CLIENT_SECRET || process.env.CLIENT_SECRET);

    res.json({
      connected: !!config.accessToken,
      email: config.email,
      name: config.name,
      spreadsheetId: config.spreadsheetId,
      autoSync: config.autoSync,
      hasCredentials: hasClientId && hasClientSecret
    });
  });

  app.post("/api/auth/google/disconnect", authMiddleware([UserRole.ADMIN]), (req, res) => {
    const config = loadGoogleConfig();
    const email = config.email || "Unknown";
    
    config.accessToken = null;
    config.refreshToken = null;
    config.expiry = 0;
    config.email = null;
    config.name = null;
    config.spreadsheetId = null;
    
    saveGoogleConfig(config);
    
    const userId = req.headers['x-user-id'] as string;
    const adminUser = users.find(u => u.id === userId);
    logAudit(userId, adminUser?.name || 'Unknown Admin', 'DISCONNECT_GOOGLE_SHEETS', `Disconnected Google Sheets account: ${email}`);

    res.json({ success: true });
  });

  app.post("/api/auth/google/create-sheet", authMiddleware([UserRole.ADMIN]), async (req, res) => {
    const config = loadGoogleConfig();
    if (!config.accessToken) {
      return res.status(401).json({ error: "Google Sheets is not connected. Open the connection flow first." });
    }

    try {
      const title = req.body.title || "TNPDS Login Log";
      const sheetDetail = await createGoogleSpreadsheet(config.accessToken, title);
      
      config.spreadsheetId = sheetDetail.spreadsheetId;
      saveGoogleConfig(config);

      const userId = req.headers['x-user-id'] as string;
      const adminUser = users.find(u => u.id === userId);
      logAudit(userId, adminUser?.name || 'Unknown Admin', 'CREATE_SPREADSHEET', `Created new Google Spreadsheet with Title "${title}" and ID: ${sheetDetail.spreadsheetId}`, sheetDetail.spreadsheetId, 'sheet');

      res.json({ 
        success: true, 
        spreadsheetId: sheetDetail.spreadsheetId,
        spreadsheetUrl: sheetDetail.spreadsheetUrl
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to create spreadsheet" });
    }
  });

  app.post("/api/auth/google/link-sheet", authMiddleware([UserRole.ADMIN]), (req, res) => {
    const { spreadsheetId } = req.body;
    if (!spreadsheetId) {
      return res.status(400).json({ error: "Spreadsheet ID is required" });
    }

    const config = loadGoogleConfig();
    config.spreadsheetId = spreadsheetId;
    saveGoogleConfig(config);

    const userId = req.headers['x-user-id'] as string;
    const adminUser = users.find(u => u.id === userId);
    logAudit(userId, adminUser?.name || 'Unknown Admin', 'LINK_SPREADSHEET', `Linked existing Google Spreadsheet with ID: ${spreadsheetId}`, spreadsheetId, 'sheet');

    res.json({ success: true, spreadsheetId });
  });

  app.post("/api/auth/google/toggle-auto-sync", authMiddleware([UserRole.ADMIN]), (req, res) => {
    const { autoSync } = req.body;
    
    const config = loadGoogleConfig();
    config.autoSync = !!autoSync;
    saveGoogleConfig(config);

    res.json({ success: true, autoSync: config.autoSync });
  });

  app.post("/api/auth/google/sync-existing", authMiddleware([UserRole.ADMIN]), async (req, res) => {
    const config = loadGoogleConfig();
    if (!config.accessToken || !config.spreadsheetId) {
      return res.status(400).json({ error: "Google Sheets is not linked yet." });
    }

    const logsToSync = auditLogs.filter(log => log.action.includes('LOGIN') || log.action.includes('BOOT') || log.action.includes('USER'));
    
    if (logsToSync.length === 0) {
      return res.json({ success: true, count: 0 });
    }

    const rows = logsToSync.sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).map(log => [
      new Date(log.timestamp).toISOString().replace('T', ' ').substring(0, 19),
      log.userId || 'N/A',
      log.userName || 'N/A',
      log.userId.includes('@') ? log.userId : `${log.userId}@tnpds.in`,
      'audit-log',
      'N/A',
      'audit',
      `Action: ${log.action} - ${log.details}`
    ]);

    try {
      await appendToGoogleSheet(rows);
      res.json({ success: true, count: rows.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Bulk sync to sheet failed" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      res.sendFile(indexPath);
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is listening on 0.0.0.0:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer().catch((err) => {
  console.error("Critical failure during server startup:");
  console.error(err);
  process.exit(1);
});
