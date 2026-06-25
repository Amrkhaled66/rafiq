export type LeadFormData = {
    name: string;
    phone: string;
};

export type HubSpotField = {
    name: string;
    value: string;
};

export type HubSpotSubmissionBody = {
    fields: HubSpotField[];
};

export const buildHubSpotSubmissionBody = ({
    name,
    phone,
}: LeadFormData): HubSpotSubmissionBody => {
    return {
        fields: [
            { name: "firstname", value: name },
            { name: "rafiq_phone_number", value: phone },
        ],
    };
};