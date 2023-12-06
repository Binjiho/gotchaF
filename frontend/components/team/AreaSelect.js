import EditItem from "@/components/team/EditItem";
import PrevFullModal from "@/components/modal/PrevFullModal";
import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import addressJson from "@/constants/addressCity.json";
import { Typeahead } from "react-bootstrap-typeahead";

export default function AreaSelect({ address, setAddress }) {
  const [showModal, setShowModal] = useState(false);
  const [addressList, setAddressList] = useState([]);

  const handleButtonClick = () => {
    setShowModal(true);
  };

  const getCityList = () => {
    const addressList = [];

    addressJson.regcodes.map(item => {
      addressList.push(...item.list);
    });

    setAddressList(addressList);
  };

  useEffect(() => {
    if (!showModal) return;
    getCityList();
  }, [showModal]);

  useEffect(() => {
    if (!address[0]?.code) return;
    setShowModal(false);
  }, [address]);

  return (
    <>
      <EditItem
        placeholder={`지역 선택`}
        title={`지역`}
        value={address[0]?.name}
        onButtonClick={handleButtonClick}></EditItem>
      <PrevFullModal show={showModal} setShow={setShowModal}>
        <p type={`middle`}>지역 설정</p>
        <main type={`content`}>
          <Form className={`mt-3 flex flex-column gap-[16px]`}>
            <Form.Group controlId="control1">
              <Typeahead
                id={`cityType`}
                labelKey="name"
                onChange={setAddress}
                options={addressList}
                placeholder="지역을 선택하세요"
                selected={address}
                emptyLabel={`지역이 없습니다.`}
                inputProps={{ required: true, className: "form-select form-select-40" }}
              />
            </Form.Group>
          </Form>
        </main>
      </PrevFullModal>
    </>
  );
}
