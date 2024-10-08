import {
    API_CONFIG
} from './apiConfig.js';

const login = async (username, password) => {
    try {
        const response = await fetch(API_CONFIG.endpoints.auth, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        return error;
    }
};

const register = async (username, password) => {
    try {
        const response = await fetch(API_CONFIG.endpoints.register, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        });
        if (!response.ok) {
            return response.json();
        }
        const data = await response.json();
        return data;
    } catch (error) {
        return error;
    }
};

const fetchDetailCoin = async (coin) => {
    const token = getCookie('token'); // Ambil token dari cookie

    try {
        const response = await fetch(API_CONFIG.endpoints.detailCoin(coin), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error fetching data: ${response.status} ${response.statusText}`, errorData);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching coin details:', error);
        return { error: true, message: error.message };
    }
};

const fetchCoin = async (page, limit, time, keyword, abortSignal) => {
    const token = getCookie('token'); // Ambil token dari cookie

    try {
        const response = await fetch(API_CONFIG.endpoints.allCoin(page, limit, time, keyword), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Menambahkan token pada header
            },
            signal: abortSignal // Pass the abort signal
        });

        if (!response.ok) {
            return response.json();
        }

        const data = await response.json();
        return data;
    } catch (error) {
        // Only throw the error if it's not an abort error
        if (error.name === 'AbortError') {
            throw error; // Re-throw the abort error to be handled elsewhere
        }

        // Return a general error object for non-abort cases
        return { error: "Request failed", details: error };
    }
};

const fetchCoinList = async (keyword) => {
    const token = getCookie('token'); // Ambil token dari cookie

    try {
        const response = await fetch(API_CONFIG.endpoints.coinList(keyword), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Menambahkan token pada header
            },
        });

        if (!response.ok) {
            return response.json();
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        return error;
    }
};

export {
    login,
    register,
    fetchDetailCoin,
    fetchCoin,
    fetchCoinList,
};