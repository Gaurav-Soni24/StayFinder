import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container grid gap-8 px-4 py-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Support</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="#" className="transition-colors hover:text-foreground">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="#" className="transition-colors hover:text-foreground">
                Safety Information
              </Link>
            </li>
            <li>
              <Link href="#" className="transition-colors hover:text-foreground">
                Cancellation Options
              </Link>
            </li>
            <li>
              <Link href="#" className="transition-colors hover:text-foreground">
                COVID-19 Response
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Community</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="#" className="transition-colors hover:text-foreground">
                StayFinder.org
              </Link>
            </li>
            <li>
              <Link href="#" className="transition-colors hover:text-foreground">
                Support Refugees
              </Link>
            </li>
            <li>
              <Link href="#" className="transition-colors hover:text-foreground">
                Combating Discrimination
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Hosting</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="#" className="transition-colors hover:text-foreground">
                Try Hosting
              </Link>
            </li>
            <li>
              <Link href="#" className="transition-colors hover:text-foreground">
                Protection for Hosts
              </Link>
            </li>
            <li>
              <Link href="#" className="transition-colors hover:text-foreground">
                Explore Hosting Resources
              </Link>
            </li>
            <li>
              <Link href="#" className="transition-colors hover:text-foreground">
                Visit Community Forum
              </Link>
            </li>
            <li>
              <Link href="#" className="transition-colors hover:text-foreground">
                How to Host Responsibly
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">About</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="#" className="transition-colors hover:text-foreground">
                Newsroom
              </Link>
            </li>
            <li>
              <Link href="#" className="transition-colors hover:text-foreground">
                Learn About New Features
              </Link>
            </li>
            <li>
              <Link href="#" className="transition-colors hover:text-foreground">
                Careers
              </Link>
            </li>
            <li>
              <Link href="#" className="transition-colors hover:text-foreground">
                Investors
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} StayFinder, Inc. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="#" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
