                                                    CÁC CÔNG NGHỆ SỬ DỤNG

---- FrontEnd: ReactJS, TailwindCSS
---- BackEnd: Firebase
---- Other: EmailJSl
layout ban đầu -> Home gồm các menu: Home, About, Contact, Sign Up, Shopping Carts, Profile
------------------------------------------ `Phần User`-------------------------------------
---> `1. Nếu user chưa đăng nhập thì sẽ hiện phần menu Sign Up và phần Shopping Carts, Profile khi user nhấn sẽ chuyển trang tới Sign Up`
---> `2. Có 2 Options đăng nhập đăng kí email hoặc với Google`
---> `3. Nếu user đăng nhập thì sẽ gửi xác thực email nếu use chưa xác thực sẽ không Log In được`
---> `4. Khi đã đăng nhập thành công sẽ chuyển trang sang Home và phần Sign Up sẽ được ẩn đi tránh gây nhầm lẫn cho user`
---> `5. Phần Shopping Carts và Profile sẽ không bị chuyển sang Sign Up mà thay vào đó là Shopping Carts của user và Profile thông tin user`
---> `6. Các Page của Laptop, Phone, Watch sẽ bao gồm bộ lọc filters để lọc sản phẩm theo nhu cầu users và phân trang hiển thị sản phẩm để tăng hiệu suất`
---> `7. User khi chọn 1 sản phẩm sẽ chuyển đến trang ProductDetail của sản phẩm gồm thông tin sản phẩm và add cart, buy now`
---> `8. User bấm buy now sẽ chuyển trang đến checkout để user điền thông tin và kiểm tra thông tin sản phẩm, khi checkout thành công sẽ gửi mail`
---> `9. Khi user thêm sản phẩm vào Shopping Carts sẽ lấy thông tin của product đẩy lên database phần Shopping Carts của user, trong Shopping Carts sẽ cho lựa chọn nhìu sản phẩm cùng lúc để checkout`
---> `10. Khi checkout thành công sẽ chuyển trang sang page MyOrders của user hiển thị thông tin gồm phần Shipping, Cancellation, Return, Completed`
---> `11. User có thể coi chi tiết đơn hàng khi nhấn vào sản phẩm ở MyOrders sẽ chuyển trang đến OrdersDetail hiển thị thông tin sản phẩm, trạng thái đặt hàng`
---> `12. Trong page OrderDetail user có thể Cancel đơn hàng và sẽ chuyển trang phần Cancellation của MyOrders`
