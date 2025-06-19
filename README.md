
# EOTC Answers - Frontend

This is the frontend code for the Ethiopian Orthodox Tewahedo Church Answers application. The design is fully responsive and includes all the modern UI elements and animations from the original React application.

## Files Structure

- `index.html` - Main HTML file with complete markup
- `styles.css` - Complete CSS with all styling, animations, and responsive design
- `script.js` - JavaScript for interactivity and PHP integration helpers

## Features

### Design Elements
- Modern gradient backgrounds with floating elements
- Animated hero section with pulse effects
- Interactive cards with hover effects
- Responsive grid layouts
- Beautiful typography with Inter font
- Dark mode support (automatic based on system preference)

### Interactive Components
- Fixed header with navigation buttons
- AI question submission form
- Bottom navigation bar
- Download banner with close functionality
- Smooth animations and transitions
- Toast notifications system

### PHP Integration Ready
The JavaScript includes utility functions for easy PHP backend integration:

```javascript
// Submit question to PHP backend
EOTCApp.submitQuestion("Your question here");

// Get teachings from PHP API
EOTCApp.getTeachings({ category: "theology" });

// User authentication
EOTCApp.authenticate({ email: "user@email.com", password: "password" });
```

## PHP Backend Integration

To integrate with your PHP backend, you'll need to create these API endpoints:

### Required Endpoints

1. **POST** `/api/questions/submit` - Handle question submissions
2. **GET** `/api/teachings` - Get teachings list
3. **GET** `/api/faqs` - Get FAQ list
4. **POST** `/api/auth/login` - User authentication
5. **POST** `/api/auth/register` - User registration

### Example PHP Response Format

```php
// For questions/submit
{
    "success": true,
    "message": "Question submitted successfully",
    "question_id": 123
}

// For teachings
{
    "success": true,
    "data": [
        {
            "id": 1,
            "title": "Teaching Title",
            "category": "Theology",
            "read_time": "5 min read",
            "content": "Teaching content..."
        }
    ]
}
```

## Customization

### Colors
The CSS uses CSS custom properties (variables) for easy color customization:

```css
:root {
    --primary-500: #f59e0b;  /* Main amber color */
    --orange-500: #f97316;   /* Orange accent */
    --blue-500: #3b82f6;     /* Blue for FAQ section */
}
```

### Fonts
Currently uses Inter font from Google Fonts. To change:

1. Update the Google Fonts link in `index.html`
2. Update the `font-family` in CSS

### Layout
The design is fully responsive with breakpoints at:
- Mobile: < 640px
- Tablet: 640px - 768px
- Desktop: > 768px

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox support required
- JavaScript ES6+ features used

## Installation

1. Upload the three files to your web server
2. Ensure your PHP backend endpoints are set up
3. Update the API endpoints in `script.js` if needed
4. Test the integration

## Notes

- All animations are CSS-based for smooth performance
- JavaScript is vanilla (no frameworks required)
- Ready for progressive enhancement with PHP
- SEO-friendly semantic HTML structure
- Accessible design with proper ARIA labels

This frontend maintains all the visual appeal and functionality of the original React application while being perfectly suited for PHP backend integration.
