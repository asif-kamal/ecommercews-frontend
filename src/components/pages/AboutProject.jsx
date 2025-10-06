import React from "react";
import { Linkedin, Mail, Code, Database, Shield, Globe } from "lucide-react";

const AboutProject = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About This Project
          </h1>
          <p className="text-xl text-gray-600">
            A Modern Full-Stack E-Commerce Application
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <p className="text-lg text-gray-700 leading-relaxed">
              This is an impressive full-stack application with modern architecture. Let me break down how these technologies work together:
            </p>
          </section>

          {/* Spring Boot + React Integration */}
          <section>
            <div className="flex items-center mb-4">
              <Code className="text-blue-600 mr-3" size={24} />
              <h2 className="text-2xl font-semibold text-gray-900">Spring Boot + React Integration</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Your architecture follows a decoupled frontend-backend pattern:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-3">Backend (Spring Boot):</h3>
                <ul className="text-green-700 space-y-2">
                  <li>• Runs as a standalone RESTful API server (typically on port 8080)</li>
                  <li>• Exposes endpoints for products, cart, orders, authentication</li>
                  <li>• Handles business logic, data persistence, and security</li>
                  <li>• Returns JSON responses to the frontend</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-3">Frontend (React):</h3>
                <ul className="text-blue-700 space-y-2">
                  <li>• Runs as a separate application (typically on port 3000 in dev)</li>
                  <li>• Makes HTTP requests (using Axios/Fetch) to Spring Boot endpoints</li>
                  <li>• Manages UI state, routing (React Router), and user interactions</li>
                  <li>• Stores JWT tokens (localStorage/sessionStorage) for authenticated requests</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Communication Flow:</h4>
              <code className="text-sm text-gray-700">
                User → React UI → HTTP Request (with JWT) → Spring Boot API → PostgreSQL<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;← JSON Response ←
              </code>
            </div>
          </section>

          {/* Authentication */}
          <section>
            <div className="flex items-center mb-4">
              <Shield className="text-green-600 mr-3" size={24} />
              <h2 className="text-2xl font-semibold text-gray-900">Spring Security + JWT + OAuth2 Google Sign-In</h2>
            </div>
            <p className="text-gray-700 mb-4">
              This is where your authentication gets sophisticated:
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Authentication Flow:</h3>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">1. OAuth2 Google Sign-In:</h4>
                  <div className="text-yellow-700 space-y-1 text-sm">
                    <div>User clicks "Sign in with Google"</div>
                    <div>→ Redirected to Google's OAuth consent screen</div>
                    <div>→ User authorizes</div>
                    <div>→ Google returns authorization code</div>
                    <div>→ Spring Security exchanges code for access token</div>
                    <div>→ Retrieves user info (email, name, profile)</div>
                    <div>→ Spring creates/updates user in PostgreSQL</div>
                    <div>→ Generates custom JWT token</div>
                    <div>→ Returns JWT to React frontend</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">2. JWT (JSON Web Token) Structure:</h4>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-700 mb-2">Your Spring Boot backend generates JWTs containing:</p>
                  <pre className="text-sm text-gray-600">
{`{
  "sub": "user@email.com",
  "roles": ["ROLE_USER"],
  "iat": 1696550400,
  "exp": 1696636800
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">3. Spring Security Configuration Components:</h4>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h5 className="font-medium text-gray-800">SecurityFilterChain:</h5>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Configures which endpoints are public (/api/auth/**, /api/products/**)</li>
                      <li>• Which require authentication (/api/cart/**, /api/orders/**)</li>
                      <li>• Adds JWT filter before UsernamePasswordAuthenticationFilter</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4">
                    <h5 className="font-medium text-gray-800">JwtAuthenticationFilter:</h5>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Intercepts every request</li>
                      <li>• Extracts JWT from Authorization: Bearer &lt;token&gt; header</li>
                      <li>• Validates signature and expiration</li>
                      <li>• Sets authentication in SecurityContext</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h5 className="font-medium text-gray-800">OAuth2LoginSuccessHandler:</h5>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Handles successful Google OAuth2 login</li>
                      <li>• Creates/updates user in database</li>
                      <li>• Generates JWT</li>
                      <li>• Redirects to frontend with token (or returns in response)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Database */}
          <section>
            <div className="flex items-center mb-4">
              <Database className="text-purple-600 mr-3" size={24} />
              <h2 className="text-2xl font-semibold text-gray-900">Neon DB (Serverless PostgreSQL) Integration</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Why Neon DB is Perfect for Your Project:</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">1. Connection Configuration:</h4>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <pre className="text-sm text-gray-600">
{`spring.datasource.url=jdbc:postgresql://<neon-host>.neon.tech/ecommerce
spring.datasource.username=<username>
spring.datasource.password=<password>
spring.jpa.hibernate.ddl-auto=update`}
                      </pre>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">2. Serverless Benefits:</h4>
                    <ul className="text-gray-700 space-y-2">
                      <li>• <strong>Auto-scaling:</strong> Database scales with your traffic (crucial for e-commerce spikes)</li>
                      <li>• <strong>Branching:</strong> Create database branches for testing features (like Git for databases)</li>
                      <li>• <strong>Cold starts:</strong> Inactive databases sleep, reducing costs</li>
                      <li>• <strong>Connection pooling:</strong> Built-in, handles Spring Boot connection management efficiently</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">3. Spring Data JPA Integration:</h4>
                    <p className="text-gray-700 mb-2">Your entities (User, Product, Cart, Order) are automatically mapped to Neon tables:</p>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <pre className="text-sm text-gray-600">
{`@Entity
public class Product {
    @Id @GeneratedValue
    private Long id;
    private String name;
    private BigDecimal price;
    // Hibernate translates this to Neon PostgreSQL tables
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CORS */}
          <section>
            <div className="flex items-center mb-4">
              <Globe className="text-orange-600 mr-3" size={24} />
              <h2 className="text-2xl font-semibold text-gray-900">WebConfig - The CORS Bridge</h2>
            </div>
            
            <p className="text-gray-700 mb-4">
              Your WebConfig is critical for allowing React and Spring Boot to communicate across different origins:
            </p>
            
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">The Problem:</h4>
                <ul className="text-red-700 space-y-1">
                  <li>• React dev: http://localhost:3000</li>
                  <li>• Spring Boot: http://localhost:8080</li>
                  <li>• Browsers block cross-origin requests by default (CORS policy)</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">The Solution:</h4>
                <div className="bg-white p-4 rounded border">
                  <pre className="text-sm text-gray-600">
{`@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")  // Apply to all API endpoints
            .allowedOrigins(
                "http://localhost:3000",  // Dev
                "https://your-deployed-site.com"  // Prod
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)  // Important for cookies/auth headers
            .maxAge(3600);  // Cache preflight requests for 1 hour
    }
}`}
                  </pre>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">How It Works:</h4>
                <div className="space-y-1 text-gray-700 text-sm">
                  <div>1. React makes a request to http://localhost:8080/api/products</div>
                  <div>2. Browser sends preflight OPTIONS request first</div>
                  <div>3. Spring Boot responds with CORS headers allowing the origin</div>
                  <div>4. Browser allows the actual request to proceed</div>
                  <div>5. React receives the data</div>
                </div>
              </div>
            </div>
          </section>

          {/* Additional Architecture Highlights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Additional Architecture Highlights</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">1. Cart Management Strategy:</h3>
                <p className="text-gray-700 mb-2">You likely implemented one of these patterns:</p>
                <ul className="text-gray-700 space-y-1 ml-4">
                  <li>• <strong>Session-based cart:</strong> Cart stored in backend session (requires sticky sessions)</li>
                  <li>• <strong>Database-persisted cart:</strong> Cart saved to PostgreSQL (survives logout)</li>
                  <li>• <strong>JWT-embedded cart:</strong> Cart data in token (limited by token size)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">2. Security Best Practices:</h3>
                <ul className="text-gray-700 space-y-1 ml-4">
                  <li>• <strong>JWT Refresh Tokens:</strong> Implement refresh tokens for better security</li>
                  <li>• <strong>HTTPS Only:</strong> Ensure production uses HTTPS to protect tokens in transit</li>
                  <li>• <strong>XSS Protection:</strong> React's JSX provides built-in XSS protection</li>
                  <li>• <strong>CSRF Protection:</strong> Not needed for stateless JWT APIs</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">3. Production Deployment Architecture:</h3>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <pre className="text-sm text-gray-600">
{`Cloudflare/CDN (React static files)
         ↓
    Vercel/Netlify (React hosting)
         ↓ API calls
    Railway/Render (Spring Boot)
         ↓
    Neon DB (PostgreSQL)`}
                  </pre>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">4. Scalability Features:</h3>
                <ul className="text-gray-700 space-y-1 ml-4">
                  <li>• <strong>Database indexing:</strong> Index product names, user emails for faster queries</li>
                  <li>• <strong>Caching:</strong> Redis/Caffeine cache for frequently accessed products</li>
                  <li>• <strong>Connection pooling:</strong> HikariCP manages DB connections efficiently with Neon</li>
                  <li>• <strong>Pagination:</strong> Implement Pageable for product listings</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">5. Error Handling:</h3>
                <ul className="text-gray-700 space-y-1 ml-4">
                  <li>• Global exception handler with @ControllerAdvice</li>
                  <li>• Standardized error responses (HTTP status codes + messages)</li>
                  <li>• Frontend error boundaries in React</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Future Features */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Potential Next Features</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="text-gray-700 space-y-2">
                <li>• <strong>Order History & Tracking:</strong> Full order lifecycle management</li>
                <li>• <strong>Admin Dashboard:</strong> Product CRUD operations, order management</li>
                <li>• <strong>Search & Filtering:</strong> Elasticsearch integration</li>
                <li>• <strong>Email Notifications:</strong> SendGrid/AWS SES for order confirmations</li>
              </ul>
              <ul className="text-gray-700 space-y-2">
                <li>• <strong>Image Upload:</strong> AWS S3/Cloudinary for product images</li>
                <li>• <strong>Reviews & Ratings:</strong> User feedback system</li>
                <li>• <strong>Inventory Management:</strong> Real-time stock tracking</li>
                <li>• <strong>Recommendation Engine:</strong> "Customers also bought" features</li>
              </ul>
            </div>
          </section>

          {/* Developer Info */}
          <section className="border-t pt-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Developer</h2>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Asif Kamal</h3>
                <div className="flex justify-center space-x-6">
                  <a
                    href="mailto:asif.kamal1489@gmail.com"
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition"
                  >
                    <Mail size={20} />
                    <span>asif.kamal1489@gmail.com</span>
                  </a>
                  <a
                    href="https://linkedin.com/in/asif-kamal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition"
                  >
                    <Linkedin size={20} />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutProject;