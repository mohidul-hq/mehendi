# Taslima Mehendi Artist - Admin User Manual

Taslima Mehendi Artist platform ke admin panel mein aapka swagat hai. Yeh guide aapko batayega ki aap bookings, services, gallery images, testimonials aur site settings ko kaise manage kar sakte hain.

---

## 1. Admin Dashboard Kaise Open Karein
- **URL**: Apni live website par `/admin` ya `/admin/login` par jayen.
- **Login**: Apna admin email aur password enter karein.
- **Initial Setup**: Aapka initial admin account website setup ke time create ho gaya tha.

## 2. Bookings Manage Karna
Customers ki saari bookings aapko dashboard ke **Bookings** section mein dikhengi.
- **View Bookings**: Yahan aap saari pending, confirmed, cancelled, aur completed bookings dekh sakte hain.
- **Accept/Confirm**: Kisi bhi pending booking ko approve karne ke liye uspar click karein aur confirm karein. Customer (aur secondary admin) ko automatically ek confirmation email chala jayega.
- **Cancel/Reject**: Agar aap booking accept nahi kar sakte, toh aap use cancel kar sakte hain. Customer ko automatically cancellation email chala jayega.

## 3. Services Manage Karna
**Services** tab mein aap set kar sakte hain ki aap kaun kaun se Mehendi designs offer karte hain.
- **Add Service**: Nayi service add karein - title, description, price, aur cover image ke sath.
- **Edit/Delete**: Kisi bhi service ka price change karein ya purani service delete karein. 
*(Note: Customers inhi active services mein se choose karke booking karenge.)*

## 4. Gallery Manage Karna
**Gallery** aapka portfolio hai jo public website par dikhta hai.
- **Upload Images**: Naye Mehendi designs ki photos upload karein. Sabhi images Cloudinary par securely host hoti hain.
- **Delete Images**: Apne portfolio ko fresh rakhne ke liye purane designs ko remove kar dein.

## 5. Testimonials Manage Karna
Customer ke feedback ko aap **Testimonials** tab se manage kar sakte hain.
- **Add Testimonials**: Apne past clients ke achhe reviews manually add karein.
- **Toggle Visibility**: Aap kisi bhi testimonial ko permanently delete kiye bina homepage par hide ya show kar sakte hain.

## 6. Email Notifications aur Secondary Admin
System automatically emails send karne ke liye Gmail ka use karta hai.
- **Primary Admin**: Ise naye bookings ka alert milta hai. Yeh `.env` file mein `ADMIN_EMAIL` ke zariye set hota hai.
- **Secondary Admin**: Yeh ek hidden (BCC) email hai jise *har* system email ki copy milti hai (Jaise ki new bookings, confirmations, cancellations, etc.). Yeh `.env` file mein `SECONDARY_ADMIN_EMAIL` mein set hota hai.

**Zaroori Email Configuration (Google App Passwords)**:
Kyunki automated systems ke liye ab normal Gmail password kaam nahi karta, aapko ek **App Password** generate karna hoga:
1. Apne Google Account ki Security settings mein jayen.
2. **2-Step Verification** ko on karein.
3. Ek **App Password** create karein.
4. Us 16-character code ko apni `.env` file mein bina kisi space ke daal dein.

## 7. Site Settings aur Availability
- **Availability**: Aapne working hours update karein aur specific dates (jaise holidays) ko block karein jab aap bookings accept nahi kar rahe hain.
- **Settings**: Apni basic business information jaise WhatsApp number, phone number aur social links ko update karein jo website ke footer mein dikhte hain.
