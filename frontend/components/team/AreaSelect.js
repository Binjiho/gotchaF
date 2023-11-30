import EditItem from "@/components/team/EditItem";
import PrevFullModal from "@/components/modal/PrevFullModal";
import { useState, useEffect } from "react";
import axios from "axios";
import { Form } from "react-bootstrap";

export default function AreaSelect() {
  const [showModal, setShowModal] = useState(false);
  const [cityList, setCityList] = useState(null);
  const [detailCityList, setDetailCityList] = useState(null);
  const [cityType, setCityType] = useState("");
  const [detailCityType, setDetailCityType] = useState("");

  const handleButtonClick = () => {
    setShowModal(true);
  };

  const getCityList = function () {
    axios({
      url: `/map/regcodes/`,
      method: "get",
      params: {
        regcode_pattern: "*00000000",
      },
    }).then(res => {
      setCityList(res.data.regcodes);
    });
  };

  const getDetailCityList = function () {
    const city = cityType.substr(0, 2);

    axios({
      url: `/map/regcodes/`,
      method: "get",
      params: {
        regcode_pattern: `${city}*`,
      },
    }).then(res => {
      setDetailCityList(res.data.regcodes);
    });
  };

  useEffect(() => {
    if (!showModal) return;
    getCityList();
  }, [showModal]);

  useEffect(() => {
    if (!cityType) return;
    getDetailCityList();
  }, [cityType]);

  return (
    <>
      <EditItem
        placeholder={`지역 선택`}
        title={`지역`}
        onButtonClick={handleButtonClick}></EditItem>
      <PrevFullModal show={showModal} setShow={setShowModal}>
        <p type={`middle`}>지역 설정</p>
        <main type={`content`}>
          <Form>
            <Form.Group controlId="control1">
              <Form.Label>시 선택</Form.Label>
              <Form.Select
                required
                value={cityType}
                size={40}
                onChange={e => setCityType(e.target.value)}>
                <option value="" disabled hidden>
                  지역을 선택하세요
                </option>
                {cityList?.map(item => (
                  <option value={item.code} key={item.code}>
                    {item.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="control2">
              <Form.Label>동 선택</Form.Label>
              <Form.Select
                required
                value={detailCityType}
                size={40}
                onChange={e => setDetailCityType(e.target.value)}>
                <option value="" disabled hidden>
                  지역을 선택하세요
                </option>
                {detailCityList?.map(item => (
                  <option value={item.code} key={item.code}>
                    {item.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </main>
      </PrevFullModal>
    </>
  );
}
