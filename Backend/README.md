# Django Backend for Dashboard Project

## Setup
1. Create virtual environment:
   ```bash
   python -m venv venv
   ```

2. Activate virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

## Development Server
```bash
python manage.py runserver 0.0.0.0:3001
```

## API Endpoints
- GET `/api/test-connection/` - Test database connection
- GET `/api/tables/` - List database tables
