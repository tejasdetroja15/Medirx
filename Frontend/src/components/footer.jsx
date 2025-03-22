import { Link } from "react-router-dom";
import './components.css';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 footer">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between footmain">
          <div className="w-full md:w-1/3 mb-6 md:mb-0 name">
            <h3 className="text-xl font-bold mb-2">PharmaCare</h3>
            <p className="text-sm">
              Your trusted online pharmacy and health partner.
            </p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0 quicklinks">
            <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
            <ul className="text-sm">
              <li>
                <Link to="#" className="hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <a to="#" className="hover:text-primary">
                  Contact
                </a>
              </li>
              <li>
                <a to="#" className="hover:text-primary">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a to="#" className="hover:text-primary">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/3 contact">
            <h4 className="text-lg font-semibold mb-2">Contact Us</h4>
            <p className="text-sm contact">1234 Pharmacy Street</p>
            <p className="text-sm contact">Healthville, MED 56789</p>
            <p className="text-sm contact">Phone: (123) 456-7890</p>
            <p className="text-sm contact">Email: info@pharmacare.com</p>
          </div>
        </div>
        <div className="mt-8 text-center text-sm">
          &copy; {new Date().getFullYear()} PharmaCare. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
