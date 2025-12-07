from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from controllers.sales_controller import router as sales_router
from database import init_db

app = FastAPI(
    title="TruEstate Sales Management API",
    description="API for retail sales management with advanced search, filtering, sorting, and pagination",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration - Allow frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",      # Next.js dev server
        "http://127.0.0.1:3000",
        "https://*.vercel.app",       # Vercel deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
def startup_event():
    init_db()

# Include routers
app.include_router(sales_router)

@app.get("/", tags=["Health"])
def read_root():
    """Root endpoint - API info"""
    return {
        "name": "TruEstate Sales Management API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}
