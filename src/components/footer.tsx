import Image from "next/image";
import Link from "next/link";
import { Github, Linkedin, Rss } from "lucide-react";

export function Footer() {
  return (
    <footer className="editorial-footer">
      <div className="editorial-footer-inner">
        <div className="flex items-center gap-3">
          <Link href="/" className="masthead-brand" aria-label="CryptoFlex home">
            <span className="masthead-brand-mark">
              <Image
                src="/CFLogo.png"
                alt="CryptoFlex"
                width={993}
                height={314}
                className="masthead-brand-img"
              />
            </span>
            <span className="masthead-brand-kicker">{"// chris johnson"}</span>
          </Link>
        </div>

        <div className="editorial-footer-links">
          <Link href="/blog">Blog</Link>
          <Link href="/portfolio">Work</Link>
          <Link href="/about">About</Link>
          <Link href="/services">Services</Link>
          <Link href="/contact">Contact</Link>
          <a
            href="https://www.linkedin.com/in/chris-johnson-secops/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <a
            href="https://github.com/chris2ao"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <Github className="h-4 w-4" />
          </a>
          <a href="/feed.xml" aria-label="RSS feed">
            <Rss className="h-4 w-4" />
          </a>
          <span className="editorial-footer-meta">
            © {new Date().getFullYear()} CryptoFlex LLC
          </span>
        </div>
      </div>
    </footer>
  );
}
