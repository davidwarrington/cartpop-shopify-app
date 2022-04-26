import QRCode from "react-qr-code";

const GeneratedQRCode = ({ product }) => {
  return (
    <div className="relative flex justify-center overflow-auto py-9 px-2 bg-gray-50">
      <div className="bg-white border rounded-md p-5">
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
