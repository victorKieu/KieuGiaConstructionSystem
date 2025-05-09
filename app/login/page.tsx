import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {
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

          {/* Form đăng nhập tĩnh */}
          <div className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Tên đăng nhập
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  id="username"
                  type="text"
                  className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Nhập tên đăng nhập"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Nhập mật khẩu"
                />
              </div>
            </div>

            <div>
              <Link
                href="/dashboard"
                className="block w-full text-center bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
              >
                Đăng Nhập
              </Link>
            </div>
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
