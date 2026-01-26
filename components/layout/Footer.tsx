export default function Footer() {
  return (
    <footer className="relative z-10 px-6 md:px-16 py-16 border-t border-border text-center">
      <div className="flex justify-center mb-8">
        <div className="w-9 h-9 bg-gradient-to-br from-accent-red to-accent-orange rounded-lg flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C8.5 2 5 4 4 7C3 10 4 13 6 15L4 22L8 20L12 22L16 20L20 22L18 15C20 13 21 10 20 7C19 4 15.5 2 12 2Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
      <p className="text-text-muted text-sm mb-6">
        © 2024 Red Elephant Research. All rights reserved.
        <br />
        For research purposes only. Not for human consumption.
      </p>
      <div className="flex justify-center gap-8 flex-wrap">
        {['Privacy Policy', 'Terms of Service', 'Contact'].map((link) => (
          <a
            key={link}
            href="#"
            className="text-text-secondary text-sm hover:text-accent-orange transition-colors interactive"
          >
            {link}
          </a>
        ))}
      </div>
    </footer>
  )
}