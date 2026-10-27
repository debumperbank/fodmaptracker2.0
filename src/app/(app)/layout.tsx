import { requireUser } from "@/lib/data";
export default async function ProtectedLayout({children}:{children:React.ReactNode}){await requireUser();return children;}
