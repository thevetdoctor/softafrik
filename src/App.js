import React, { useEffect, useState } from 'react';
import './App.css';
import api from './utils/api';
import { gatewayUrl, mailServiceUrl } from './utils/constants';

const App = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  useEffect(() => {
    console.log('gateway url',gatewayUrl ?? 'not found')
    console.log('mail service url', mailServiceUrl ?? 'not found')
  }, []);

  const sendData = async (body) => {
    try {
      console.log('Form Data:', body);
      body.template = `We received your message: ${body.message}`;
      body.from = 'Softafrik NG';
      // const response = await api.post('/feedback', body, { headers: { 'Authorization': 'Bearer FqjKT1ULwU4TaFSm5BPb' } });
      const response = await fetch('/feedback', body, { headers: { 'Authorization': 'Bearer FqjKT1ULwU4TaFSm5BPb' } });
      console.log('Response:', response.data);
      setFormData({
        name: '',
        email: '',
        message: '',
      })
      return true;
    } catch (error) {
      console.error('Error:', error.message);
      alert(`Error: ${error.message}`);
      return false;
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    setIsDisabled(true)
    e.preventDefault();
    const result = await sendData(formData);
    setIsDisabled(false)
    if (result) setIsSubmitted(true);
  };

  const handleConfirm = () => {
    setIsSubmitted(false);
    alert('Thank you so much!');
  };

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section className="bg-purple-800 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">SoftAfrik</h1>
          <p className="text-lg mb-6">Delivering high-quality web and mobile applications.</p>
          <button
            onClick={() => {
              const aboutUsSection = document.getElementById('about-us');
              aboutUsSection.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-white text-purple-800 px-6 py-3 rounded-md font-semibold"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8">
            <ServiceCard
              title="Web Development"
              description="Custom web & mobile application built with modern technologies."
            />
            <ServiceCard
              title="Enterprise Solutions"
              description="Infuse your business processes with cutting-edge enterprise solutions for better efficiency and great returns."
            />
            <ServiceCard
              title="UI/UX Design"
              description="Beautiful and user-friendly interfaces."
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about-us" className="py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">About Us</h2>
          <p className="text-lg">
            At SoftAfrik, we combine creativity and technical expertise to deliver top-notch digital
            solutions. Our team of experienced developers and designers is committed to bringing
            your vision to life.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-purple-800 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
          <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    className="w-full px-4 py-2 rounded-md text-black"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-2 rounded-md text-black"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    className="w-full px-4 py-2 rounded-md text-black"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <button 
                disabled={isDisabled} 
                className="bg-white text-purple-800 px-6 py-3 rounded-md font-semibold">
                  { !isDisabled ? 'Send Message' : 'Processing' }
                </button>
              </form>
            ) : (
              <div className="bg-green-100 p-6 rounded-lg shadow-md text-center">
                <h2 className="text-lg font-semibold text-green-800 mb-4">
                  Thank you for your message!
                </h2>
                <p className="text-green-700 mb-6">
                  We’ve received your message and will get back to you shortly.
                </p>
                <button
                  onClick={handleConfirm}
                  className="bg-green-800 text-white px-6 py-3 rounded-md font-semibold"
                >
                  Confirm
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

const ServiceCard = ({ title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    <p>{description}</p>
  </div>
);

export default App;
