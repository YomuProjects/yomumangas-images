import axios from "axios";
import { NextFunction, Request, Response } from "express";

const api = axios.create({ baseURL: "https://api.yomumangas.com" });

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.headers["authorization"] === process.env.SECRET_TOKEN) {
            next();
        } else {
            const token = req.headers['authorization'] as string;

            if (!token) return res.status(401).json({ message: "You need a token to use this endpoint." });

            const { data } = await api.get("/auth/upload", { headers: { authorization: token } });

            if (!data.username) return res.status(401).json({ message: "Invalid token!" });

            next();
        }
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}