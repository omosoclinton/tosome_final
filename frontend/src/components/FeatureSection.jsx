const FeaturesSection = () => {
    return (
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <img src="/path/to/icon1.svg" alt="Expert Tutors" className="mx-auto mb-4 w-16 h-16"/>
              <h3 className="text-xl font-bold mb-2">Expert Tutors</h3>
              <p className="text-gray-600">Expert tutors for every subject and every level.</p>
            </div>
            <div className="text-center">
              <img src="/path/to/icon2.svg" alt="Personalized Sessions" className="mx-auto mb-4 w-16 h-16"/>
              <h3 className="text-xl font-bold mb-2">Personalized Sessions</h3>
              <p className="text-gray-600">Tailor-made lessons to fit your learning style.</p>
            </div>
            <div className="text-center">
              <img src="/path/to/icon3.svg" alt="Flexible Scheduling" className="mx-auto mb-4 w-16 h-16"/>
              <h3 className="text-xl font-bold mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600">Choose when and how you want to learn.</p>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default FeaturesSection;
  