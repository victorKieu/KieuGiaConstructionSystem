import Image from "next/image"
import Link from "next/link"

export default function LoginPage({
  searchParams,
}: {
  searchParams: { returnUrl?: string }
}) {
  const returnUrl = searchParams.returnUrl || "/dashboard"

  return (
    <div className="flex min-h-screen">
      {/* Form đăng nhập */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-white">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <Image src="/logo-kieu-gia.png" alt="Kieu Gia Logo" width={150} height={150} className="mb-4" />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Kieu Gia Construction</h1>
            <p className="text-gray-600 mt-1">Đăng Nhập Hệ Thống</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <form className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <Link
                  href={returnUrl}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>

          <div className="text-center mt-8 text-gray-600 text-sm">
            <p>Nâng Tầm Cuộc Sống, Giá Trị Tương Lai</p>
          </div>
        </div>
      </div>

      {/* Sidebar thông tin */}
      <div className="hidden lg:flex lg:flex-col lg:w-1/2 bg-gray-800 text-white p-10">
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Kieu Gia Construction</h2>
          <p className="text-gray-300 mb-10">Hệ thống quản lý toàn diện cho công ty xây dựng hàng đầu Việt Nam</p>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">Tầm nhìn:</h3>
              <p className="text-gray-300">
                Trở thành công ty tư vấn và xây dựng hàng đầu tại Việt Nam, nổi bật với chất lượng công trình và dịch vụ
                khách hàng xuất sắc.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Sứ mệnh:</h3>
              <p className="text-gray-300">
                Đem đến giải pháp xây dựng tối ưu, an toàn và bền vững cho khách hàng, góp phần phát triển hạ tầng và đô
                thị Việt Nam.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
