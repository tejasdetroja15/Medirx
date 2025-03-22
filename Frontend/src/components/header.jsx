import { Link } from "react-router-dom";
import { Button } from "@nextui-org/react";
import './components.css';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center head">
        <Link href="/" className="text-2xl font-bold text-primary">
          PharmaCare
        </Link>
        <nav>
          <ul className="flex space-x-4 navi">
            <li>
              <Link
                href="#symptom-checker"
                className="text-gray-600 hover:text-primary"
              >
                Symptom Checker
              </Link>
            </li>
            <li>
              <Link
                href="#prescription"
                className="text-gray-600 hover:text-primary"
              >
                Prescriptions
              </Link>
            </li>
            <li>
              <Link
                href="#medicine-search"
                className="text-gray-600 hover:text-primary"
              >
                Find Medicines
              </Link>
            </li>
          </ul>
        </nav>
        <Button>Sign In</Button>
      </div>
    </header>
  );
}
