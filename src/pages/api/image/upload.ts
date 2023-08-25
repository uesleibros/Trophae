import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import supabase from "@/supabase.js";

const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") {
		return res.status(401).json({
			"error": "Only post method allowed.",
			"status": 401
		});
	}

	if (!req.body.image) {
		return res.status(422).json({
			"error": "Missing account or image field in the body.",
			"status": 422
		});
	}

	if (!await supabase.auth.getUser()) {
		return res.status(422).json({
			"error": "You are not authorized.",
			"status": 422
		});
	}

	try {
		const response = await axios.post("https://api.imgur.com/3/image", {
			image: req.body.image,
			type: "base64"
		}, {
			headers: {
				Authorization: `Client-ID ${IMGUR_CLIENT_ID}`
			}
		});

		const { data } = response.data;
		return res.status(200).json(data);
	} catch (error) {
		return res.status(500).json({
			"error": "An error occurred while uploading the image.",
			"status": 500
		});
	}
}
