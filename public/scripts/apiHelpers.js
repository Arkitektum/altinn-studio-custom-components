/**
 * Fetches display layouts from the local API endpoint.
 *
 * @async
 * @function fetchDisplayLayouts
 * @returns {Promise<Object>} A promise that resolves to the JSON response containing display layouts.
 * @throws {Error} If the fetch request fails or the response is not OK.
 */
export async function fetchDisplayLayouts() {
    const url = `http://localhost:9001/api/displayLayouts`;
    return fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch DisplayLayout.json: ${response.statusText}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error("Error fetching DisplayLayout.json:", error);
            throw error;
        });
}
