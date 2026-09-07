import axios from 'axios';
import dns from 'dns/promises';
import { URL } from 'url';

export const getGeoLocation = async (ipAddress) => {
    // Updated empty Geo to match the exact fields React-Leaflet map needs
    const emptyGeo = { 
        ip: ipAddress,
        hostname: ipAddress,
        country: "Unknown", 
        city: "Unknown", 
        lat: 0, 
        lng: 0, 
        asn: "Unknown",
        provider: "Unknown",
        risk: 'Suspicious',
        status: 'Suspicious'
    };

    if (!ipAddress || ipAddress === "Unknown") return emptyGeo;

    try {
        const response = await axios.get(`http://ip-api.com/json/${ipAddress}`);
        if (response.data.status === 'success') {
            return {
                ip: ipAddress,
                hostname: response.data.reverse || ipAddress,
                country: response.data.country,
                city: response.data.city,
                lat: response.data.lat,
                lng: response.data.lon, // React-Leaflet prefers 'lng' instead of 'lon'
                asn: response.data.as || "Unknown",
                provider: response.data.isp,
                risk: 'Suspicious',
                status: 'Suspicious'
            };
        }
    } catch (error) {
        console.error(`Geolocation query failed for IP ${ipAddress}:`, error.message);
    }
    return emptyGeo;
};

export const traceUrlInfrastructure = async (urlString) => {
    try {
        const parsedUrl = new URL(urlString);
        const resolved = await dns.lookup(parsedUrl.hostname);
        const geo = await getGeoLocation(resolved.address);

        return {
            url: urlString,
            domain: parsedUrl.hostname,
            resolvedIP: resolved.address,
            serverLocation: geo
        };
    } catch (error) {
        return {
            url: urlString,
            domain: "Unresolvable",
            resolvedIP: "Unknown",
            serverLocation: { country: "Unknown", city: "Unknown", lat: 0, lng: 0, provider: "Unknown" }
        };
    }
};