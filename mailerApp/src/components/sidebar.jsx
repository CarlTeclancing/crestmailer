import { Users, Mail, Send, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";


export default function Sidebar() {
  return (
    <aside className="w-72 bg-white border-r border-blue-400 p-6 fixed top-20 left-0 h-[calc(100vh-5rem)] flex flex-col justify-between">
      
      {/* Top section */}
      <div>
       
        <nav className="space-y-4">
          
          <NavLink
            to="/contacts"
            className={({ isActive }) =>
              `flex items-center gap-3 w-full px-4 py-3 rounded-lg text-violet-500 ${
                isActive ? "bg-violet-100 font-medium" : "hover:bg-violet-100"
              }`
            }
          >
            <Users size={18} />
            Contacts
          </NavLink>

          <NavLink
            to="/send"
            className={({ isActive }) =>
              `flex items-center gap-3 w-full px-4 py-3 rounded-lg text-violet-500 ${
                isActive ? "bg-violet-100 font-medium" : "hover:bg-violet-100"
              }`
            }
          >
            <Mail size={18} />
            Mails
          </NavLink>

          <NavLink
            to="/compose"
            className={({ isActive }) =>
              `flex items-center gap-3 w-full px-4 py-3 rounded-lg text-violet-500 ${
                isActive ? "bg-violet-100 font-medium" : "hover:bg-violet-100"
              }`
            }
          >
            <Send size={18} />
            Send Mail
          </NavLink>

        </nav>
      </div>

      {/* Bottom section (Settings) */}
      <div>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 w-full px-4 py-3 rounded-lg text-violet-500 ${
              isActive ? "bg-violet-100 font-medium" : "hover:bg-violet-100"
            }`
          }
        >
          <Settings size={18} />
          Settings
        </NavLink>
      </div>

    </aside>
  );
}