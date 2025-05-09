import { LoginForm } from "@/components/auth/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex justify-center">
            <Image
              src="/logo-kieu-gia.png"
              alt="Kieu Gia Logo"
              width={80}
              height={80}
              className="h-20 w-auto"
              priority
            />
          </div>
          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-amber-500 to-amber-700">
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-white p-8">
              <h1 className="text-4xl font-bold mb-4">Hệ Thống Quản Lý Xây Dựng</h1>
              <p className="text-xl">Kiều Gia Construction</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
