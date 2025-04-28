import LoginForm from "@/components/login-form"

export default function Home() {
  return (
    <div className="flex min-h-screen">
      {/* Left panel - Login form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-white p-8">
        <div className="w-full max-w-md flex flex-col items-center">
          <div className="mb-6 text-center">
            {/* Sử dụng thẻ img thông thường thay vì Next.js Image */}
            <div className="w-32 h-32 mx-auto mb-4">
              <img src="/logo.ico" alt="Kieu Gia Construction Logo" width="128" height="128" className="mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mt-4">Kieu Gia Construction</h1>
            <p className="mt-2 text-xl font-medium text-gray-700">Đăng Nhập Hệ Thống</p>
          </div>
          <LoginForm />
          <p className="mt-8 text-center text-gray-600">Nâng Tầm Cuộc Sống, Giá Trị Tương Lai</p>
        </div>
      </div>

      {/* Right panel - Company info */}
      <div className="hidden md:flex md:w-1/2 bg-[#3c3836] text-white p-12 flex-col justify-center">
        <h2 className="text-3xl font-bold mb-4">Kieu Gia Construction</h2>
        <p className="mb-8 text-gray-200">Hệ thống quản lý toàn diện cho công ty xây dựng hàng đầu Việt Nam</p>

        <div className="bg-[#2c2826] rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-2">Tầm nhìn:</h3>
          <p className="text-gray-300">
            Trở thành công ty tư vấn và xây dựng hàng đầu tại Việt Nam, nổi bật với chất lượng công trình và dịch vụ
            khách hàng xuất sắc.
          </p>
        </div>

        <div className="bg-[#2c2826] rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Sứ mệnh:</h3>
          <p className="text-gray-300">
            Đem đến giải pháp xây dựng tối ưu, an toàn và bền vững cho khách hàng, góp phần phát triển hạ tầng và đô thị
            Việt Nam.
          </p>
        </div>
      </div>
    </div>
  )
}
