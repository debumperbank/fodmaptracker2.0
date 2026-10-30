import type { Metadata } from "next";
import { requireUser } from "@/lib/data";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function ProtectedLayout({children}:{children:React.ReactNode}){await requireUser();return children;}
