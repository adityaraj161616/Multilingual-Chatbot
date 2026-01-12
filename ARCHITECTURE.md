# Campus Assistant - System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client (Browser)                     │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐   │
│  │ Landing  │  │   Chat   │  │  Admin Dashboard   │   │
│  │   Page   │  │ Interface│  │                    │   │
│  └──────────┘  └──────────┘  └────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                  Next.js API Routes                      │
│  ┌──────────────┐  ┌────────────────┐  ┌────────────┐ │
│  │  /api/chat   │  │ /api/admin/*   │  │  Auth MW   │ │
│  └──────────────┘  └────────────────┘  └────────────┘ │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                   Business Logic Layer                   │
│  ┌──────────────┐  ┌────────────────┐  ┌────────────┐ │
│  │ AI Service   │  │  FAQ Matcher   │  │  Auth      │ │
│  │ (Intent)     │  │  (Semantic)    │  │  Service   │ │
│  └──────────────┘  └────────────────┘  └────────────┘ │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                     Data Access Layer                    │
│  ┌──────────────┐  ┌────────────────┐  ┌────────────┐ │
│  │   MongoDB    │  │    Groq API    │  │  Sessions  │ │
│  │   (FAQs,     │  │   (AI Model)   │  │ (LocalStor)│ │
│  │    Convs)    │  │                │  │            │ │
│  └──────────────┘  └────────────────┘  └────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Query Flow

```
Student → Chat Interface → API Route → AI Service
                                      (Intent Analysis)
                                            ↓
                                      FAQ Matcher
                                      (Semantic Search)
                                            ↓
                                      MongoDB
                                      (Fetch FAQ)
                                            ↓
                                      Response
                                            ↓
Student ← Chat Interface ← API Route ← Format Answer
```

### 2. Admin Management Flow

```
Admin → Login → JWT Token → Dashboard
                              ↓
                        FAQ Manager
                              ↓
                        CRUD Operations
                              ↓
                          MongoDB
                              ↓
                    Real-time Updates
```

## Component Interactions

### Chat System

1. **User sends message**
   - Frontend: Adds message to UI
   - Creates API request with context

2. **API receives message**
   - Validates session
   - Updates session statistics
   - Calls AI service for intent

3. **AI analyzes intent**
   - Extracts keywords
   - Determines category
   - Translates if needed

4. **FAQ matching**
   - Searches by keywords
   - Filters by category
   - Returns best match

5. **Response delivery**
   - Gets answer in user's language
   - Stores conversation
   - Returns to frontend

6. **Frontend updates**
   - Displays assistant message
   - Updates UI state
   - Auto-scrolls

### Admin System

1. **Authentication**
   - Login with credentials
   - Password verification (bcrypt)
   - JWT token generation
   - Token storage (localStorage)

2. **FAQ Management**
   - Fetch all FAQs
   - Create/Update/Delete
   - Multilingual validation
   - Priority management

3. **Analytics**
   - Aggregate from conversations
   - Calculate statistics
   - Generate charts
   - Real-time updates

## Security Architecture

### Authentication Flow

```
Admin Login → Credentials → bcrypt verify → JWT generate
                                                 ↓
                                          Store Token
                                                 ↓
API Request → Extract Token → Verify JWT → Allow/Deny
```

### Data Privacy

- **No Personal Data**: Only anonymous session IDs
- **Encrypted Passwords**: bcrypt hashing
- **Secure Tokens**: JWT with expiration
- **Environment Isolation**: Secrets in .env
- **API Protection**: Middleware checks

## Database Design

### Indexes

```typescript
// FAQ Model
- Text index on all question fields
- Index on category
- Index on isActive

// Conversation Model
- Index on sessionId (unique)
- Index on lastMessageAt

// Session Model
- Index on sessionId (unique)
- Index on language

// Admin Model
- Index on email (unique)
```

### Relationships

```
Session (1) ───── (1) Conversation
                       │
                       │ (many)
                       ↓
                   Messages
                       │
                       │ (refers to)
                       ↓
                     FAQ
```

## Scalability Considerations

### Current Scale (MVP)
- Up to 1000 concurrent users
- ~10,000 FAQs
- ~100,000 conversations/month

### Scaling Strategies

1. **Database**
   - Add read replicas
   - Implement caching (Redis)
   - Partition by college/department

2. **API**
   - Horizontal scaling (multiple instances)
   - Load balancing
   - Rate limiting

3. **AI Service**
   - Queue system for intent analysis
   - Batch processing
   - Cache common intents

4. **Frontend**
   - CDN for static assets
   - Service worker caching
   - Code splitting

## Monitoring & Logging

### Key Metrics to Track

1. **Performance**
   - API response time
   - Database query time
   - AI service latency

2. **Usage**
   - Active sessions
   - Messages per day
   - FAQ hit rate

3. **Quality**
   - Resolution rate
   - Unanswered queries
   - User satisfaction (if implemented)

### Logging Strategy

```typescript
// Info: Normal operations
console.log('[INFO] User query processed')

// Error: Exceptions and failures
console.error('[ERROR] Database connection failed', error)

// Debug: Development insights
console.debug('[DEBUG] Intent analysis result:', intent)
```

## AI Integration Architecture

### Intent Analysis Pipeline

```
User Query → Language Detection → Translation to English
                                         ↓
                                  Prompt Engineering
                                         ↓
                                    AI Model
                                         ↓
                                  JSON Response
                                         ↓
                         Extract: intent, category, keywords
```

### AI Usage Constraints

- **No Free Generation**: AI cannot create new answers
- **Verification Required**: All answers from database
- **Fallback Ready**: System works without AI
- **Cost Efficient**: Minimal token usage

## Deployment Architecture

### Development
```
localhost:3000 → Next.js Dev Server → Local MongoDB
```

### Production
```
                        ┌─────────────┐
                        │   Vercel    │
                        │  (Frontend) │
                        └─────────────┘
                               ↓
                        ┌─────────────┐
                        │  Next.js    │
                        │  API Routes │
                        └─────────────┘
                          ↓         ↓
                   ┌──────────┐  ┌─────────┐
                   │ MongoDB  │  │  Groq   │
                   │  Atlas   │  │   API   │
                   └──────────┘  └─────────┘
```

## Error Handling Strategy

### Frontend
- Try-catch blocks
- Error boundaries (React)
- Toast notifications
- Fallback UI

### Backend
- Express error middleware
- Graceful degradation
- Error logging
- User-friendly messages

### Database
- Connection pooling
- Retry logic
- Transaction rollbacks
- Data validation

---

This architecture ensures scalability, maintainability, and security while providing an excellent user experience.
