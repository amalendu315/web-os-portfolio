"use client"; // Required for Next.js App Router
import React, { useState } from "react";

// --- 1. Define Interfaces for Type Safety ---

interface FoundDate {
    date: string;
    price: number;
}

interface TBORoom {
    Name: string[]; // TBO sometimes returns array of strings or objects, adjusting for common structure
    TotalFare: number;
    // Add other room properties if needed
}

interface TBOHotelResult {
    HotelCode: string;
    Rooms: TBORoom[];
}

interface TBOStatus {
    Code: number;
    Description: string;
}

interface TBOResponse {
    Status: TBOStatus;
    HotelResult?: TBOHotelResult[]; // Optional because it might not exist on error
}

export default function HotelAvailabilityTest() {
    // --- 2. Typed State ---
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [progress, setProgress] = useState<string>("");
    const [foundDates, setFoundDates] = useState<FoundDate[]>([]);

    // Helper: Pause execution for X milliseconds
    const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

    // Helper: Format Date to 'YYYY-MM-DD'
    const formatDate = (date: Date): string => {
        return date.toISOString().split("T")[0];
    };

    // --- 3. Main Automation Function ---
    const runAvailabilityCheck = async () => {
        setIsRunning(true);
        setFoundDates([]);
        console.clear();
        console.log("🚀 STARTING 1-YEAR AVAILABILITY CHECK 🚀");
        console.log("------------------------------------------------");

        // CONFIGURATION
        const TARGET_HOTEL_CODE = "1369967";
        const STAY_DURATION_DAYS = 2;
        const DAYS_TO_CHECK = 365;

        // Start checking from TOMORROW
        let currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1);

        for (let i = 0; i < DAYS_TO_CHECK; i++) {
            // -- A. Calculate Dates --
            const checkInDate = new Date(currentDate);

            const checkOutDate = new Date(currentDate);
            checkOutDate.setDate(checkOutDate.getDate() + STAY_DURATION_DAYS);

            const checkInStr = formatDate(checkInDate);
            const checkOutStr = formatDate(checkOutDate);

            // -- B. Logging Step --
            setProgress(`Checking [${i + 1}/${DAYS_TO_CHECK}]: ${checkInStr} to ${checkOutStr}`);
            console.log(`\n📅 [ITERATION ${i + 1}] Checking Dates: ${checkInStr} -> ${checkOutStr}`);

            // -- C. Prepare Payload --
            const raw = JSON.stringify({
                CheckIn: checkInStr,
                CheckOut: checkOutStr,
                HotelCodes: TARGET_HOTEL_CODE,
                GuestNationality: "IN",
                PaxRooms: [
                    {
                        Adults: 2,
                        Children: 0,
                        ChildrenAges: null,
                    },
                ],
                ResponseTime: 23,
                IsDetailedResponse: true,
                Filters: {
                    Refundable: false,
                    NoOfRooms: 1,
                    MealType: "",
                    StarRating: "",
                },
            });

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Basic VHJpcHhsOlRyaXB4bEAwMDAx");

            // Typed RequestInit
            const requestOptions: RequestInit = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow",
            };

            try {
                console.log(`   👉 Sending Request for ${checkInStr}...`);

                // -- D. The API Call --
                const response = await fetch("https://affiliate.tektravels.com/HotelAPI/Search", requestOptions);

                console.log(`   📡 HTTP Status: ${response.status} ${response.statusText}`);

                if (!response.ok) {
                    console.error("   ❌ API Error: Response was not OK");
                }

                const resultText = await response.text();

                try {
                    // Cast the parsed JSON to our Interface
                    const resultJson = JSON.parse(resultText) as TBOResponse;

                    // -- E. Analyze Response --
                    if (resultJson?.HotelResult && resultJson.HotelResult.length > 0) {
                        const hotel = resultJson.HotelResult[0];

                        if (hotel.Rooms && hotel.Rooms.length > 0) {
                            const price = hotel.Rooms[0].TotalFare;
                            console.log(`   ✅ AVAILABLE! Price: ${price}`);
                            console.log("   📝 Full Response Snippet:", resultJson);

                            // Correctly typed state update
                            setFoundDates((prev) => [...prev, { date: checkInStr, price: price }]);
                        } else {
                            console.warn("   ⚠️ Hotel found, but NO ROOMS in array.");
                        }
                    } else {
                        console.log("   ⛔ Not Available / Sold Out / Error in Status");
                        console.log("   🔍 Debug Status:", resultJson?.Status || "No Status Field");
                    }

                } catch (e) {
                    console.error("   💥 JSON Parse Error (Might be HTML response):", resultText.substring(0, 100));
                }

            } catch (error) {
                console.error("   ☠️ Network Fetch Error:", error);
            }

            // -- F. Increment Date --
            currentDate.setDate(currentDate.getDate() + 1);

            // -- G. Delay --
            await delay(500);
        }

        setIsRunning(false);
        setProgress("Completed.");
        console.log("------------------------------------------------");
        console.log("🏁 CHECK COMPLETE 🏁");
    };

    return (
        <div style={{ padding: "50px", fontFamily: "monospace" }}>
            <h1>🏨 Hotel Availability Automator</h1>
            <p>Check the <strong>Browser Console (F12)</strong> for detailed logs.</p>

            <div style={{ marginBottom: "20px" }}>
                <strong>Target Hotel:</strong> 1369967 <br />
                <strong>Span:</strong> 1 Year (365 Days)
            </div>

            <button
                onClick={runAvailabilityCheck}
                disabled={isRunning}
                style={{
                    padding: "15px 30px",
                    fontSize: "16px",
                    backgroundColor: isRunning ? "#ccc" : "#0070f3",
                    color: "white",
                    border: "none",
                    cursor: isRunning ? "not-allowed" : "pointer",
                    borderRadius: "5px"
                }}
            >
                {isRunning ? "Running Automation..." : "Start Availability Check"}
            </button>

            <div style={{ marginTop: "20px", fontSize: "18px", color: "blue" }}>
                {progress}
            </div>

            {foundDates.length > 0 && (
                <div style={{ marginTop: "30px" }}>
                    <h3>✅ Dates with Available Rooms:</h3>
                    <ul>
                        {foundDates.map((item, idx) => (
                            <li key={idx} style={{ color: "green" }}>
                                <strong>{item.date}</strong> - Price: {item.price}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}