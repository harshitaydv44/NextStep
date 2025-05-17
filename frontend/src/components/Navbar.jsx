import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react'; // Requires lucide-react for icons

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const navLinks = [
        { text: 'Home', path: '/' },
        { text: 'About', path: '/about' },
        { text: 'Roadmaps', path: '/roadmaps' },
        { text: 'Mentors', path: '/mentors' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null); // Update state to reflect logged out status
        navigate('/login'); // Redirect to login page
    };

    // Function to get the first letter of the full name
    const getInitial = (name) => {
        if (!name) return '';
        return name.charAt(0).toUpperCase();
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Next Step
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <div className="hidden md:flex items-center space-x-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
                                >
                                    {link.text}
                                </Link>
                            ))}
                        </div>
                        <div className="hidden md:flex items-center space-x-4">
                            {user ? (
                                // If logged in
                                <div className="flex items-center space-x-4">
                                    {/* User Icon */}
                                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                                        {getInitial(user.fullName)}
                                    </div>
                                    {/* Logout Button */}
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 text-gray-600 font-medium hover:text-red-600 transition-colors duration-200"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                // If not logged in
                                <>
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-4 py-2 text-white bg-blue-600 font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        Sign up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden rounded-lg p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                <div
                    className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        } overflow-hidden`}
                >
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors duration-200"
                            >
                                {link.text}
                            </Link>
                        ))}
                        {user ? (
                            // If logged in (Mobile)
                            <div className="pt-4 space-y-2 border-t border-gray-200">
                                {/* User Icon - Mobile */}
                                <div className="flex items-center justify-center py-2">
                                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                                        {getInitial(user.fullName)}
                                    </div>
                                </div>
                                {/* Logout Button - Mobile */}
                                <button
                                    onClick={() => { handleLogout(); setIsOpen(false); }}
                                    className="block w-full px-3 py-2 text-center text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors duration-200"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            // If not logged in (Mobile)
                            <div className="pt-4 space-y-2 border-t border-gray-200">
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full px-3 py-2 text-center text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors duration-200"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full px-3 py-2 text-center text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors duration-200"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
