import React from "react";
import { Linkedin, Mail, Code, Database, Shield, Globe } from "lucide-react";

const AboutProject = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            My E-commerce Platform: Technical Deep Dive
          </h1>
          <p className="text-xl text-gray-600">
            Let me walk you through how I built this e-commerce platform and how
            all the pieces fit together
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* Spring Boot + React Integration */}
          <section>
            <div className="flex items-center mb-4">
              <Code className="text-blue-600 mr-3" size={24} />
              <h2 className="text-2xl font-semibold text-gray-900">
                Spring Boot + React Integration
              </h2>
            </div>
            <p className="text-gray-700 mb-4">
              I went with a{" "}
              <strong>decoupled frontend-backend architecture</strong>:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-3">
                  Backend (Spring Boot):
                </h3>
                <ul className="text-green-700 space-y-2">
                  <li>
                    • Runs as a standalone RESTful API server (on port 8080)
                  </li>
                  <li>
                    • Exposes endpoints for products, cart, orders, and
                    authentication
                  </li>
                  <li>
                    • Handles all the business logic, data persistence, and
                    security
                  </li>
                  <li>• Returns JSON responses to the frontend</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-3">
                  Frontend (React):
                </h3>
                <ul className="text-blue-700 space-y-2">
                  <li>
                    • Runs as a separate application (port 3000 in dev, deployed
                    separately in production)
                  </li>
                  <li>
                    • Makes HTTP requests using Axios to my Spring Boot
                    endpoints
                  </li>
                  <li>
                    • Manages UI state, routing with React Router, and user
                    interactions
                  </li>
                  <li>
                    • Stores JWT tokens in localStorage for authenticated
                    requests
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">
                Communication Flow:
              </h4>
              <pre className="text-sm text-gray-700">
                {`User → React UI → HTTP Request (with JWT) → My Spring Boot API → PostgreSQL
                  ← JSON Response ←`}
              </pre>
            </div>
          </section>

          {/* Authentication */}
          <section>
            <div className="flex items-center mb-4">
              <Shield className="text-green-600 mr-3" size={24} />
              <h2 className="text-2xl font-semibold text-gray-900">
                Spring Security + JWT + OAuth2 Google Sign-In
              </h2>
            </div>
            <p className="text-gray-700 mb-4">
              This is the authentication system I implemented:
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">
                  Authentication Flow:
                </h3>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">
                    1. OAuth2 Google Sign-In:
                  </h4>
                  <div className="text-yellow-700 space-y-1 text-sm">
                    <div>User clicks "Sign in with Google"</div>
                    <div>→ Redirected to Google's OAuth consent screen</div>
                    <div>→ User authorizes</div>
                    <div>→ Google returns authorization code</div>
                    <div>
                      → My Spring Security config exchanges code for access
                      token
                    </div>
                    <div>→ Retrieves user info (email, name, profile)</div>
                    <div>→ I create/update the user in PostgreSQL</div>
                    <div>→ Generate a custom JWT token</div>
                    <div>→ Return JWT to React frontend</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  2. JWT (JSON Web Token) Structure:
                </h4>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-700 mb-2">
                    My Spring Boot backend generates JWTs containing:
                  </p>
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
                <h4 className="font-semibold text-gray-800 mb-2">
                  3. Spring Security Configuration Components I Built:
                </h4>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h5 className="font-medium text-gray-800">
                      SecurityFilterChain:
                    </h5>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>
                        • Configured which endpoints are public (/api/auth/**,
                        /api/products/**)
                      </li>
                      <li>
                        • Which require authentication (/api/cart/**,
                        /api/orders/**)
                      </li>
                      <li>
                        • Added my JWT filter before
                        UsernamePasswordAuthenticationFilter
                      </li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4">
                    <h5 className="font-medium text-gray-800">
                      JwtAuthenticationFilter:
                    </h5>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Intercepts every request</li>
                      <li>
                        • Extracts JWT from Authorization: Bearer &lt;token&gt;
                        header
                      </li>
                      <li>• Validates signature and expiration</li>
                      <li>• Sets authentication in SecurityContext</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-4">
                    <h5 className="font-medium text-gray-800">
                      OAuth2LoginSuccessHandler:
                    </h5>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Handles successful Google OAuth2 login</li>
                      <li>• Creates/updates user in my database</li>
                      <li>• Generates JWT</li>
                      <li>• Redirects to frontend with token</li>
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
              <h2 className="text-2xl font-semibold text-gray-900">
                Neon DB (Serverless PostgreSQL) Integration
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">
                  Why I Chose Neon DB:
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      1. My Connection Configuration:
                    </h4>
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
                    <h4 className="font-semibold text-gray-800 mb-2">
                      2. Serverless Benefits:
                    </h4>
                    <ul className="text-gray-700 space-y-2">
                      <li>
                        • <strong>Auto-scaling:</strong> My database scales with
                        traffic (perfect for e-commerce spikes)
                      </li>
                      <li>
                        • <strong>Branching:</strong> I can create database
                        branches for testing features (like Git for databases)
                      </li>
                      <li>
                        • <strong>Cold starts:</strong> Inactive databases
                        sleep, reducing my costs
                      </li>
                      <li>
                        • <strong>Connection pooling:</strong> Built-in, handles
                        Spring Boot connections efficiently
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      3. Spring Data JPA Integration:
                    </h4>
                    <p className="text-gray-700 mb-2">
                      My entities (User, Product, Cart, Order) are automatically
                      mapped to Neon tables:
                    </p>
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
              <h2 className="text-2xl font-semibold text-gray-900">
                WebConfig - The CORS Bridge
              </h2>
            </div>

            <p className="text-gray-700 mb-4">
              My{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">WebConfig</code>{" "}
              is critical for allowing React and Spring Boot to communicate
              across different origins:
            </p>

            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">
                  The Problem I Solved:
                </h4>
                <ul className="text-red-700 space-y-1">
                  <li>• React dev: http://localhost:3000</li>
                  <li>• Spring Boot: http://localhost:8080</li>
                  <li>
                    • Browsers block cross-origin requests by default (CORS
                    policy)
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">
                  My Solution:
                </h4>
                <div className="bg-white p-4 rounded border">
                  <pre className="text-sm text-gray-600">
                    {`@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")  // Apply to all API endpoints
            .allowedOrigins(
                "http://localhost:3000",  // Dev
                "https://my-deployed-site.com"  // Prod
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
                <h4 className="font-semibold text-gray-800 mb-2">
                  How It Works:
                </h4>
                <ol className="text-gray-700 text-sm space-y-1 list-decimal list-inside">
                  <li>
                    React makes a request to http://localhost:8080/api/products
                  </li>
                  <li>Browser sends preflight OPTIONS request first</li>
                  <li>
                    My Spring Boot responds with CORS headers allowing the
                    origin
                  </li>
                  <li>Browser allows the actual request to proceed</li>
                  <li>React receives the data</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Additional Architecture Highlights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Additional Architecture Highlights
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  1. Cart Management Strategy:
                </h3>
                <p className="text-gray-700 mb-2">
                  I implemented database-persisted carts:
                </p>
                <ul className="text-gray-700 space-y-1 ml-4">
                  <li>• Cart data stored in PostgreSQL</li>
                  <li>• Survives user logout/login</li>
                  <li>• Allows for abandoned cart recovery features</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  2. Security Best Practices I Implemented:
                </h3>
                <ul className="text-gray-700 space-y-1 ml-4">
                  <li>
                    • <strong>JWT with expiration:</strong> Access tokens expire
                    after a set time
                  </li>
                  <li>
                    • <strong>HTTPS enforcement:</strong> Production uses HTTPS
                    to protect tokens in transit
                  </li>
                  <li>
                    • <strong>XSS Protection:</strong> React's JSX provides
                    built-in XSS protection
                  </li>
                  <li>
                    • <strong>Input validation:</strong> Server-side validation
                    on all endpoints
                  </li>
                  <li>
                    • <strong>Password encoding:</strong> BCrypt hashing for any
                    password-based accounts
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  3. Production Deployment Architecture:
                </h3>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <pre className="text-sm text-gray-600">
                    {`CDN (React static files)
         ↓
    Frontend Hosting (React app)
         ↓ API calls
    Backend Hosting (Spring Boot)
         ↓
    Neon DB (PostgreSQL)`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  4. Scalability Features I Built In:
                </h3>
                <ul className="text-gray-700 space-y-1 ml-4">
                  <li>
                    • <strong>Database indexing:</strong> Indexed product names,
                    user emails for faster queries
                  </li>
                  <li>
                    • <strong>Connection pooling:</strong> HikariCP (Spring Boot
                    default) manages DB connections efficiently with Neon
                  </li>
                  <li>
                    • <strong>Pagination:</strong> Implemented Pageable for
                    product listings
                  </li>
                  <li>
                    • <strong>Optimized queries:</strong> Used JPA projections
                    to avoid fetching unnecessary data
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  5. Error Handling:
                </h3>
                <ul className="text-gray-700 space-y-1 ml-4">
                  <li>• Global exception handler with @ControllerAdvice</li>
                  <li>
                    • Standardized error responses (HTTP status codes + JSON
                    messages)
                  </li>
                  <li>
                    • Frontend error boundaries in React for graceful failures
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Future Features */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Upcoming Features I'm Planning
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="text-gray-700 space-y-2">
                <li>
                  1. <strong>Order History & Tracking:</strong> Full order
                  lifecycle management
                </li>
                <li>
                  2. <strong>Admin Dashboard:</strong> Product CRUD operations,
                  order management
                </li>
                <li>
                  3. <strong>Advanced Search & Filtering:</strong> PostgreSQL
                  full-text search or Elasticsearch
                </li>
                <li>
                  4. <strong>Email Notifications:</strong> Order confirmations
                  and updates
                </li>
                <li>
                  5. <strong>Image Upload:</strong> Cloud storage integration
                  for product images
                </li>
              </ul>
              <ul className="text-gray-700 space-y-2">
                <li>
                  6. <strong>Reviews & Ratings:</strong> User feedback system
                </li>
                <li>
                  7. <strong>Inventory Management:</strong> Real-time stock
                  tracking
                </li>
                <li>
                  8. <strong>Recommendation Engine:</strong> "Customers also
                  bought" features
                </li>
                <li>
                  9. <strong>Payment Integration:</strong> Stripe or PayPal
                  checkout
                </li>
                <li>
                  10. <strong>Wishlist Feature:</strong> Save products for later
                </li>
              </ul>
            </div>
          </section>

          {/* Key Takeaways */}
          <section className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Key Takeaways from Building This
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>
                The combination of{" "}
                <strong>Spring Security's robust authentication</strong>,{" "}
                <strong>JWT's stateless scalability</strong>,
                <strong> React's modern UI capabilities</strong>, and{" "}
                <strong>Neon's serverless database</strong> has given me a
                highly maintainable and scalable e-commerce platform.
              </p>
              <p>
                The separation of concerns between frontend and backend makes it
                easy to iterate on features independently. Using JWT tokens
                means my backend is completely stateless, making it easy to
                scale horizontally if needed. And Neon DB's serverless nature
                means I don't have to worry about database provisioning or
                scaling.
              </p>
              <p className="font-medium">
                I'd love to hear your thoughts and feedback on the project!
              </p>
            </div>
          </section>

          {/* AI Development Assistance */}
          <section className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              AI-Assisted Development with Claude
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>
                One of the most valuable aspects of building this project was
                leveraging <strong>AI prompting with Claude</strong> to resolve
                complex development challenges and accelerate feature
                implementation.
              </p>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">
                  Key Areas Where Claude Helped:
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span>
                      <strong>API Integration:</strong> Troubleshooting and
                      optimizing API calls from the React frontend to Spring
                      Boot backend, including proper error handling and data
                      formatting
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span>
                      <strong>Cart Feature Implementation:</strong> Rapidly
                      developing a seamless shopping cart system with React
                      Context API, localStorage persistence, and backend
                      integration
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span>
                      <strong>Google Sign-In Integration:</strong> Implementing
                      OAuth2 authentication flow with proper JWT token handling
                      and user session management
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span>
                      <strong>Email Verification System:</strong> Setting up
                      secure email code verification with Spring Mail and proper
                      validation flows
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span>
                      <strong>Google Console Configuration:</strong> Navigating
                      Google Cloud Console for OAuth2 client setup, alongside
                      this helpful tutorial:{" "}
                      <a
                        href="https://www.youtube.com/watch?v=MutS1GVvCnQ"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        YouTube Guide
                      </a>
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-lg border-l-4 border-purple-500">
                <p className="text-gray-800">
                  <strong>Development Approach:</strong> Using AI assistance
                  allowed me to focus on architecture decisions and business
                  logic while quickly resolving implementation challenges. This
                  significantly accelerated the development timeline and helped
                  me learn best practices for each technology stack component.
                </p>
              </div>
            </div>
          </section>

          {/* Developer Info */}
          <section className="border-t pt-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Developer
              </h2>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Asif Kamal
                </h3>
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
