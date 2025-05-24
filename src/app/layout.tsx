import './globals.css'
import {ClusterProvider} from '@/components/cluster/cluster-data-access'
import {SolanaProvider} from '@/components/solana/solana-provider'
import {UiLayout} from '@/components/ui/ui-layout'
import {ReactQueryProvider} from './react-query-provider'
import ConditionalLayout from './conditional-layout'
import SessionProvider from '@/providers/SessionProvider'

export const metadata = {
  title: 'DappHunt',
  description: 'Discover and hunt the best dApps',
}

const links: { label: string; path: string }[] = [
  { label: 'Account', path: '/account' },
  { label: 'Clusters', path: '/clusters' },
  { label: 'Counter Program', path: '/counter' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <ReactQueryProvider>
            <ClusterProvider>
              <SolanaProvider>
                <ConditionalLayout>{children}</ConditionalLayout>
              </SolanaProvider>
            </ClusterProvider>
          </ReactQueryProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
