# API Testing Guide

## Prerequisites
- Backend server running on http://localhost:5000
- MongoDB connection configured

## Test Cases

### 1. Test LeetCode API Integration

Test with a known LeetCode username (e.g., "uwi" - a well-known competitive programmer):

**LeetCode Profile**: https://leetcode.com/uwi/
**API Endpoint**: https://alfa-leetcode-api.onrender.com/uwi

### 2. Test Codeforces API Integration

Test with a known Codeforces username (e.g., "tourist" - top-rated):

**Codeforces Profile**: https://codeforces.com/profile/tourist

### 3. Add a Test User

```bash
# Using curl (Windows PowerShell)
curl -X POST http://localhost:5000/api/leaderboard `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Test User\",\"leetcodeUsername\":\"uwi\",\"codeforcesUsername\":\"tourist\"}'

# Using PowerShell Invoke-RestMethod
$body = @{
    name = "Test User"
    leetcodeUsername = "uwi"
    codeforcesUsername = "tourist"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/leaderboard" -Method POST -Body $body -ContentType "application/json"
```

### 4. Get Leaderboard

```bash
# Using curl
curl http://localhost:5000/api/leaderboard

# Using PowerShell
Invoke-RestMethod -Uri "http://localhost:5000/api/leaderboard" -Method GET
```

### 5. Refresh User Stats

```bash
# Replace USER_ID with actual MongoDB _id from GET response
curl -X PUT http://localhost:5000/api/leaderboard/USER_ID/refresh

# Using PowerShell
Invoke-RestMethod -Uri "http://localhost:5000/api/leaderboard/USER_ID/refresh" -Method PUT
```

## Expected Response Format

### Successful User Addition
```json
{
  "_id": "...",
  "name": "Test User",
  "leetcodeUsername": "uwi",
  "codeforcesUsername": "tourist",
  "leetcodeURL": "https://leetcode.com/uwi",
  "codeforcesURL": "https://codeforces.com/profile/tourist",
  "leetcodeQuestions": 2500,
  "leetcodeRating": 15000,
  "codeforcesQuestions": 3000,
  "codeforcesRating": 3700,
  "totalQuestions": 5500,
  "rankScore": 55485.00,
  "lastUpdated": "2026-01-18T...",
  "createdAt": "2026-01-18T..."
}
```

## Common Issues

### Issue: "Invalid username format"
- **Cause**: Username contains invalid characters
- **Solution**: Use only letters, numbers, underscores, and hyphens
  - Valid: `john_doe`, `user123`, `coder-pro`
  - Invalid: `user@name`, `user.name`, `user name`

### Issue: "All fields are required"
- **Cause**: Missing name or usernames
- **Solution**: Provide all three fields:
  - `name`: Your display name
  - `leetcodeUsername`: Your LeetCode username (not URL)
  - `codeforcesUsername`: Your Codeforces username (not URL)

### Issue: Stats showing as 0
- **Causes**:
  1. Username doesn't exist on the platform
  2. Profile is private or restricted
  3. API timeout (slow network)
  4. Rate limiting
- **Solution**: 
  - Verify username exists and profile is public
  - Try again after a few seconds
  - Check backend console logs for detailed error messages

### Issue: Timeout errors
- **Cause**: API taking too long to respond
- **Solution**: 
  - Increase timeout in server.js (currently 10 seconds)
  - Check your internet connection
  - Try during off-peak hours

## Performance Benchmarks

| Operation | Expected Time |
|-----------|---------------|
| Add User (parallel API calls) | 3-5 seconds |
| Refresh Single User | 3-5 seconds |
| Get Leaderboard | < 100ms |
| Batch Refresh (10 users) | 30-50 seconds |

## Notes

- LeetCode API is unofficial and may change without notice
- Codeforces API has rate limits (5 requests per 2 seconds per IP)
- Consider implementing caching for production use
- Stats are fetched in real-time, so initial addition may be slower
