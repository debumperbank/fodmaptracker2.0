import Link from "next/link";
import { Brand } from "@/components/Brand";
import { signOut } from "@/lib/actions";
import { requireUser } from "@/lib/data";
export async function AppShell({ children, active, email }: {children: React.ReactNode;active:string;email:string}) {
 const links=[{href:"/dashboard",label:"Overzicht",key:"dashboard",icon:"◫"},{href:"/recepten",label:"Recepten",key:"recepten",icon:"◇"},{href:"/weekmenu",label:"Weekmenu",key:"weekmenu",icon:"▦"},{href:"/profiel",label:"Profiel",key:"profiel",icon:"○"}];
 const {supabase}=await requireUser();const {data:adminCheck}=await supabase.rpc("is_app_admin");const isAdmin=adminCheck===true;
 return <><div className="app-shell"><header className="topbar"><Brand/><div className="top-actions"><Link className="btn" href="/voeding">+ Maaltijd</Link><Link className="btn btn-secondary" href="/klachten">+ Klacht</Link>{isAdmin&&<Link className="btn btn-secondary" href="/admin">Beheerder</Link>}</div><div className="account-actions"><span className="subtle account-email">{email}</span><form action={signOut}><button className="btn btn-secondary compact-btn">Uitloggen</button></form></div></header>{children}<p className="footer-note">Fodmap Tracker helpt je gegevens bij te houden en stelt geen diagnose. Bespreek voedingskeuzes met een gekwalificeerde diëtist.</p></div><nav className="mobile-nav" aria-label="Hoofdnavigatie">{links.map(x=><Link key={x.key} className={active===x.key?"active":""} href={x.href}><span className="nav-icon">{x.icon}</span>{x.label}</Link>)}</nav></>;
}
