const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const square = entry.target.querySelector('.dress');
  
      if (entry.isIntersecting) {
        square.classList.add('trans');
        return; // if we added the class, exit the function
      }
  
      // We're not intersecting, so remove the class!
      square.classList.remove('trans');
    });
  });
  
  observer.observe(document.querySelector('.row'));