// "use client";

// import { useState, useEffect } from "react";

// function useFetch(url: string) {
//   const [imageUrl, setImageUrl] = useState("");
//   const [data, setData] = useState(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const response = await fetch(url);
//         if (!response.ok) {
//           throw new Error('HTTP error! status: ${response.status}');
//         }
//         const result = await response.json();
//         setData(result);
//       } catch (err) {
//         setError((err as Error).message);
//         console.error("Failed to fetch data:", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, [url]);

//   return { data, error, loading };
// }

// export default function Profile() {
//   const { data, error, loading } = useFetch('http://localhost:7071/api/AnalyzeReceipt');

//   return (
//     <div>
//       <h1>Upload Receipt Image URL:</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           value={imageUrl}
//           onChange={(e) => setImageUrl(e.target.value)}
//           placeholder="Enter image URL"
//           required
//           style={{ padding: "8px", width: "300px" }}
//         />
//         <button type="submit" style={{ marginLeft: "10px", padding: "8px 16px" }}>
//           Analyze
//         </button>
//       </form>

//       {loading && <p>Loading...</p>}
//       {error && <p>Error: {error}</p>}
//       {result && (
//         <div>
//           <h2>Analysis Result:</h2>
//           <pre>{JSON.stringify(result, null, 2)}</pre>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState } from "react";

export default function Profile() {
  const [imageUrl, setImageUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:7071/api/AnalyzeReceipt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ DocumentUrl: imageUrl }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setResult(result);
    } catch (err) {
      setError((err as Error).message);
      console.error("Failed to analyze receipt:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Upload Receipt Image URL:</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Enter image URL"
          required
          style={{ padding: "8px", width: "300px" }}
        />
        <button type="submit" style={{ marginLeft: "10px", padding: "8px 16px" }}>
          Analyze
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {result && (
        <div>
          <h2>Analysis Result:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
