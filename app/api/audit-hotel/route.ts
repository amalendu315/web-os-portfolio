import { NextResponse } from "next/server";

// --- 1. CONFIGURATION ---
const TARGET_HOTEL_CODE = "1139046";
const DAYS_TO_CHECK = 365; // 1 Year
const STAY_DURATION = 2; // 2 Nights
const DELAY_MS = 300; // Delay between requests to avoid banning

// --- 2. HELPER FUNCTIONS ---
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const formatDate = (date: Date) => date.toISOString().split("T")[0];

// --- 3. THE API ROUTE ---
export async function GET() {
    console.log("🚀 SERVER STARTED: Initiating 365-Day Hotel Audit...");
    console.log("----------------------------------------------------");

    const results = [];
    let currentDate = new Date();
    // Start from tomorrow
    currentDate.setDate(currentDate.getDate() + 1);

    // We use a simplified loop to avoid timeouts if possible,
    // but note: Vercel/Production has a 10-60s timeout limit.
    // This script is best run on LOCALHOST.

    for (let i = 0; i < DAYS_TO_CHECK; i++) {
        // A. Calculate Dates
        const checkIn = new Date(currentDate);
        const checkOut = new Date(currentDate);
        checkOut.setDate(checkOut.getDate() + STAY_DURATION);

        const checkInStr = formatDate(checkIn);
        const checkOutStr = formatDate(checkOut);

        console.log(`\n🔹 [${i + 1}/${DAYS_TO_CHECK}] Processing: ${checkInStr} to ${checkOutStr}`);

        // B. Prepare Request
        const payload = {
            CheckIn: checkInStr,
            CheckOut: checkOutStr,
            HotelCodes: TARGET_HOTEL_CODE,
            GuestNationality: "IN",
            PaxRooms: [{ Adults: 2, Children: 0, ChildrenAges: null }],
            ResponseTime: 23,
            IsDetailedResponse: true,
            Filters: {
                Refundable: false,
                NoOfRooms: 1,
                MealType: "",
                StarRating: ""
            }
        };

        try {
            // C. Server-Side Fetch (No CORS issues here!)
            console.log(`   👉 Sending Request to TBO...`);

            const response = await fetch("https://affiliate.tektravels.com/HotelAPI/Search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Basic VHJpcHhsOlRyaXB4bEAwMDAx" // Your Base64 Key
                },
                body: JSON.stringify(payload),
                redirect: "follow"
            });

            console.log(`   📡 HTTP Status: ${response.status}`);

            const textData = await response.text();

            // D. Parse & Analyze
            try {
                const jsonData = JSON.parse(textData);

                // Check if rooms exist in the response
                if (jsonData?.HotelResult && jsonData.HotelResult.length > 0) {
                    const hotel = jsonData.HotelResult[0];

                    if (hotel.Rooms && hotel.Rooms.length > 0) {
                        const price = hotel.Rooms[0].TotalFare;
                        console.log(`   ✅ SUCCESS: Room Found! Price: ₹${price}`);
                        console.log(`   📝 Log:`, JSON.stringify(hotel.Rooms[0]).substring(0, 150) + "...");

                        results.push({
                            date: checkInStr,
                            available: true,
                            price: price,
                            currency: "INR"
                        });
                    } else {
                        console.warn(`   ⚠️  Hotel found, but Rooms array is empty.`);
                    }
                } else {
                    console.log(`   ⛔ Sold Out / Not Available.`);
                    console.log(`   🔍 TBO Status:`, jsonData?.Status?.Description || "Unknown");
                }

            } catch (parseError) {
                console.error("   💥 JSON Parse Error:", textData.substring(0, 100));
            }

        } catch (netError) {
            console.error("   ☠️ Network Error:", netError);
        }

        // E. Iterate & Delay
        currentDate.setDate(currentDate.getDate() + 1);
        await delay(DELAY_MS);
    }

    console.log("\n----------------------------------------------------");
    console.log("🏁 AUDIT COMPLETE. Returning Results JSON.");

    return NextResponse.json({
        total_scanned: DAYS_TO_CHECK,
        available_dates: results
    });
}