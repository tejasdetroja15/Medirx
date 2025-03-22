import "./components.css";

export default function Medicines() {
    const products = [
      { id: 1, imgSrc: "whitebottle.jpg", price: "₹100" },
      { id: 2, imgSrc: "whitebottle.jpg", price: "₹150" },
      { id: 3, imgSrc: "whitebottle.jpg", price: "₹120" },
      { id: 4, imgSrc: "whitebottle.jpg", price: "₹130" },
      { id: 5, imgSrc: "whitebottle.jpg", price: "₹140" },
      { id: 6, imgSrc: "whitebottle.jpg", price: "₹140" },
      { id: 7, imgSrc: "whitebottle.jpg", price: "₹140" },
      { id: 8, imgSrc: "whitebottle.jpg", price: "₹140" },
      { id: 9, imgSrc: "whitebottle.jpg", price: "₹140" },
    ];
    return (
      <>
        <div className="containers">
          {products.map((product) => (
            <div key={product.id} className="contain">
              <img src={product.imgSrc} alt="" height={200} width={200} />
              <div className="label">
                <p>{product.price}</p>
                <p>Add to Cart</p>
              </div>
            </div>
          ))}
        </div>
      </>
    );   
}
