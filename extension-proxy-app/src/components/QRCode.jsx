import QRCode from "react-qr-code";

const GeneratedQRCode = ({ product }) => {
  return (
    <div className="relative h-64 flex justify-center overflow-auto p-2 bg-gray-50">
      <div className="bg-white border rounded-md py-6 px-10">
        <QRCode
          muted
          id="qr-code-link"
          value="hello!"
          size={150}
          //title={title}
          //fgColor={hsbToHex(color)}
        />
        <p className="uppercase text-gray-700 text-xs pt-5 text-center font-medium">
          Scan to order
        </p>
      </div>
    </div>
  );
};

export default GeneratedQRCode;
