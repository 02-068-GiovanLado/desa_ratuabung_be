# Website Desa Ratu Abung - Backend API

Backend API untuk Website Desa menggunakan Node.js, Express, dan PostgreSQL.

## Tech Stack

- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT

## Setup Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
```bash
cp .env.example .env
```
Edit file `.env` sesuai konfigurasi database Anda.

### 3. Setup Database
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio
npm run prisma:studio
```

### 4. Run Development Server
```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/:slug` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Berita
- `GET /api/berita` - Get all berita
- `GET /api/berita/:slug` - Get single berita
- `POST /api/berita` - Create berita (admin)
- `PUT /api/berita/:id` - Update berita (admin)
- `DELETE /api/berita/:id` - Delete berita (admin)

### Galeri
- `GET /api/galeri` - Get all galeri
- `GET /api/galeri/:id` - Get single galeri
- `POST /api/galeri` - Create galeri (admin)
- `DELETE /api/galeri/:id` - Delete galeri (admin)

### Infografis
- `GET /api/infografis` - Get all infografis
- `GET /api/infografis/type/:type` - Get infografis by type
- `POST /api/infografis` - Create infografis (admin)
- `PUT /api/infografis/:id` - Update infografis (admin)
- `DELETE /api/infografis/:id` - Delete infografis (admin)

## Project Structure
```
webdesa-bandarrejo-api/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── config/
│   │   └── database.js        # Prisma client
│   ├── controllers/           # Business logic
│   ├── routes/                # API routes
│   └── middlewares/           # Custom middleware
├── uploads/                   # File uploads
├── .env                       # Environment variables
├── server.js                  # Entry point
└── package.json
```

## Deployment

### VPS Deployment
1. Install Node.js, PostgreSQL, Nginx
2. Clone repository
3. Install dependencies
4. Setup environment variables
5. Run migrations
6. Start with PM2: `pm2 start server.js`

### Nginx Configuration
```nginx
location /api {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

## License
ISC
