# Credits System Documentation

## Overview
The credits system tracks and manages user credits for hairstyle generation. Credits are deducted based on the number of tokens used by the AI models.

## Components

### 1. **Database Model** (`/model/user.ts`)
- Each user has a `credits` field (default: 50)
- Credits are stored in MongoDB

### 2. **Credit Calculation** (`/helper_function/calculate_credits.ts`)
- **Formula**: `credits = tokens / TOKEN_RATIO`
- **Current TOKEN_RATIO**: 400
- Example: 4000 tokens = 10 credits

### 3. **API Endpoints**

#### Get Credits (`/api/credits/get`)
- **Method**: POST
- **Body**: `{ email: string }`
- **Response**: `{ credits: number }`
- **Purpose**: Fetch user's current credit balance

#### Deduct Credits (`/api/credits/deduct`)
- **Method**: POST
- **Body**: `{ email: string, creditsToDeduct: number }`
- **Response**: `{ success: true, remainingCredits: number, deductedCredits: number }`
- **Validations**:
  - User must exist
  - Credits to deduct must be > 0
  - User must have sufficient credits
- **Purpose**: Deduct credits from user's balance

#### Generate Hairstyles (`/api/generate`)
- **Returns**: `{ results: Array, totalTokens: number }`
- **totalTokens**: Sum of tokens from text generation + all image generations

### 4. **Credit Context** (`/context/CreditContext.tsx`)
- **State**: `credits` (number)
- **Methods**:
  - `setCredits(credits: number)`: Update credits in context
  - `refreshCredits()`: Fetch latest credits from database
- **Auto-fetch**: Automatically fetches credits when user logs in

## Workflow

### When User Generates Hairstyles:

1. **User clicks "Generate Hairstyle"** in `Option.tsx`
2. **Check Authentication**: Verify user is logged in
3. **Call Generate API**: Upload image and preferences
4. **API Returns**: Results + `totalTokens`
5. **Calculate Credits**: `creditsUsed = calculateCredits(totalTokens)`
6. **Deduct from Database**: Call `/api/credits/deduct`
   - Validates user has enough credits
   - Deducts credits from database
   - Returns remaining credits
7. **Update Context**: Store remaining credits in context
8. **Navigate to Results**: Show generated hairstyles

### Error Handling:
- **Not logged in**: Alert user to log in
- **Insufficient credits**: Alert with error message
- **API failure**: Alert with error message

## Usage Examples

### Display Credits in Any Component:
```tsx
import { useCreditContext } from "@/context/CreditContext";

export default function MyComponent() {
    const { credits, refreshCredits } = useCreditContext();

    return (
        <div>
            <p>Available Credits: {credits}</p>
            <button onClick={refreshCredits}>Refresh</button>
        </div>
    );
}
```

### Manually Deduct Credits:
```tsx
const deductCredits = async (email: string, amount: number) => {
    const res = await fetch("/api/credits/deduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email,
            creditsToDeduct: amount
        })
    });

    const data = await res.json();
    if (res.ok) {
        console.log("Remaining credits:", data.remainingCredits);
    } else {
        console.error("Error:", data.error);
    }
};
```

## Configuration

### Adjust Credit Cost:
To change how many credits are used per token, edit `TOKEN_RATIO` in `/helper_function/calculate_credits.ts`:
- **Higher ratio** = fewer credits per token (cheaper)
- **Lower ratio** = more credits per token (more expensive)

Current: `400` (4000 tokens = 10 credits)

### Default Credits for New Users:
Edit the default value in `/model/user.ts`:
```typescript
credits: {
    type: Number,
    default: 50  // Change this value
}
```

## Security Notes
- Credits are validated server-side before deduction
- User authentication required for all credit operations
- Database transactions ensure credit integrity
- Insufficient credits prevent hairstyle generation
