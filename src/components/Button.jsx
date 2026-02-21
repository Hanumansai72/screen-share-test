function Button({ children, variant = 'primary', className = '', ...props }) {
    const baseStyles = 'px-6 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30',
        secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700',
        danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-500/30'
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;
