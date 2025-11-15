# Integration Example - How to Use the Enhanced Student Dashboard

## Quick Start

To use the new enhanced student dashboard with bottom navigation and Study Hub, replace the current StudentHome implementation in your App.tsx:

### Option 1: Simple Integration (Recommended for Testing)

```tsx
// In App.tsx, add this import at the top
import { StudentDashboard } from "./components/StudentDashboard";

// Then replace the student-home case in your screen rendering:
{currentScreen === "student-home" && (
  <StudentDashboard
    userId={userId!}
    onVendorSelect={(vendor) => {
      setSelectedVendor(vendor);
      setCurrentScreen("vendor-detail");
    }}
    onLogout={handleLogout}
  />
)}
```

### Option 2: Full Integration (Cleaner Architecture)

If you want to fully integrate and update your current app structure:

1. **Update the Screen type** to include individual sections:
```tsx
type Screen = 
  | "welcome" 
  | "auth" 
  | "student-dashboard"  // NEW: replaces student-home
  | "vendor-detail" 
  | "order-placement" 
  | "vendor-dashboard"
  | "vendor-onboarding"
  | "admin-users";
```

2. **Update the authentication success handler:**
```tsx
const handleAuthSuccess = (id: string, role: UserRole) => {
  setUserId(id);
  setUserRole(role);
  
  if (role === "student") {
    setCurrentScreen("student-dashboard");  // Changed from student-home
  } else if (role === "vendor") {
    // ... vendor logic
  }
};
```

3. **Render the StudentDashboard:**
```tsx
{currentScreen === "student-dashboard" && (
  <StudentDashboard
    userId={userId!}
    onVendorSelect={(vendor) => {
      setSelectedVendor(vendor);
      setCurrentScreen("vendor-detail");
    }}
    onLogout={handleLogout}
  />
)}
```

## What's Included

The StudentDashboard component automatically handles:

✅ **Home Tab** - Enhanced dry cleaning marketplace
✅ **Study Tab** - AI-powered study tools with:
  - Study reminders
  - Goal tracking
  - Flashcards
  - AI document analysis
  - Reading techniques

✅ **Orders Tab** - Order tracking and history
✅ **Profile Tab** - Account management
✅ **Bottom Navigation** - Smooth tab switching
✅ **Theme Toggle** - Light/dark mode
✅ **Trinity Branding** - Logo and colors

## Component Dependencies

All new components are already created:
- `/components/StudentDashboard.tsx` - Main container
- `/components/BottomNav.tsx` - Bottom navigation
- `/components/EnhancedStudentHome.tsx` - Enhanced marketplace
- `/components/StudyHub.tsx` - Study tools
- `/components/EnhancedOrderTracking.tsx` - Order tracking
- `/components/EnhancedProfileManagement.tsx` - Profile page

## Backward Compatibility

Don't worry! Your existing components are still intact:
- `/components/StudentHome.tsx` - Original student home
- `/components/OrderTracking.tsx` - Original order tracking
- `/components/ProfileManagement.tsx` - Original profile

You can switch between old and new versions anytime.

## Testing the Features

1. **Test the Study Hub:**
   - Click on the "Study" tab in bottom navigation
   - Try uploading a text file in AI Tools
   - Create a new study goal
   - Add a flashcard

2. **Test Enhanced Home:**
   - Browse vendors with the new UI
   - Try the filters
   - Switch between List and Map view

3. **Test Order Tracking:**
   - View your order history
   - Filter by active/completed
   - See the progress timeline

4. **Test Profile:**
   - View your profile stats
   - Update your information
   - Check the quick settings

## Customization

### Change Colors
Edit the gradient colors in the components:
- `from-blue-600 to-purple-600` - Main gradients
- `from-blue-50 to-blue-100` - Light mode backgrounds
- `dark:from-blue-900/20` - Dark mode backgrounds

### Add More Study Subjects
In StudyHub.tsx, find the flashcard creation dialog and add subjects:
```tsx
<SelectContent>
  <SelectItem value="math">Mathematics</SelectItem>
  <SelectItem value="physics">Physics</SelectItem>
  <SelectItem value="your-subject">Your Subject</SelectItem>
</SelectContent>
```

### Modify Study Techniques
In StudyHub.tsx, update the `studyTechniques` array:
```tsx
const studyTechniques = [
  { name: "Your Technique", description: "Description", icon: YourIcon },
  // ... more techniques
];
```

## API Integration

The components expect these API endpoints:
- `GET /vendors` - List vendors
- `GET /orders/:userId` - User orders
- `GET /user/:userId` - User profile
- `PUT /user/:userId` - Update profile

Make sure your backend supports these or update the API calls in the components.

## Mobile Experience

The new dashboard is mobile-first:
- Bottom navigation is optimized for thumb reach
- Cards are touch-friendly
- Spacing works on small screens
- All features accessible on mobile

## Need Help?

Check these files for more info:
- `/ENHANCED_FEATURES_GUIDE.md` - Complete feature documentation
- `/components/StudentDashboard.tsx` - Main component
- `/types/index.ts` - Updated type definitions

---

**Ready to go!** Just import StudentDashboard and enjoy the enhanced experience! 🚀
