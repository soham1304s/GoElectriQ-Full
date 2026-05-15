import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export default function AuthButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  icon,
  variant = 'default',
  className = '',
}) {
  const { theme } = useTheme();

  const variants = {
    default: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    admin: 'bg-[#022c22] hover:bg-black text-white',
    outline: theme === 'light'
      ? 'border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50'
      : 'border-2 border-green-500 text-green-400 dark:hover:bg-green-900/20',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full py-3 px-4 rounded-xl font-semibold
        flex items-center justify-center gap-2
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        shadow-lg dark:shadow-lg
        ${variants[variant]}
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {icon && <span className="flex items-center justify-center">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
}
