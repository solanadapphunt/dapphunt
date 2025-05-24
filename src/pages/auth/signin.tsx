import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { signIn, getProviders } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Chrome } from 'lucide-react'

interface SignInProps {
  providers: any
}

export default function SignIn({ providers }: SignInProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <img 
            src="/logo.png" 
            alt="DappHunt Logo" 
            className="h-12 w-auto"
          />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to DappHunt
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Discover and hunt the best Solana dApps
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            {Object.values(providers).map((provider: any) => (
              <div key={provider.name}>
                <Button
                  onClick={() => signIn(provider.id, { callbackUrl: '/' })}
                  className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6154]"
                  variant="outline"
                >
                  <Chrome className="h-5 w-5 mr-3 text-blue-500" />
                  Sign in with {provider.name}
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  By signing in, you agree to our Terms of Service
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link 
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to DappHunt
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  // If user is already signed in, redirect to home
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const providers = await getProviders()

  return {
    props: {
      providers: providers ?? {},
    },
  }
} 