import EditItem from "@/components/team/EditItem";
import PrevFullModal from "@/components/modal/PrevFullModal";
import { useState, useEffect } from "react";
import axios from "axios";
import { Form } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";

export default function AreaSelect({
  cityType,
  setCityType,
  detailCityType,
  setDetailCityType,
}) {
  const [showModal, setShowModal] = useState(false);
  const [cityList, setCityList] = useState([]);
  const [detailCityList, setDetailCityList] = useState([]);
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
    const city = cityType[0].code.substr(0, 2);

    axios({
      url: `/map/regcodes/`,
      method: "get",
      params: {
        regcode_pattern: `${city}*`,
      },
    }).then(res => {
      const arr = res.data.regcodes;
      arr.shift(); //시 제거

      const pattern = /구$/;
      const formatArr = arr.filter(item => !pattern.test(item.name));
      setDetailCityList(formatArr);
    });
  };

  useEffect(() => {
    if (!showModal) return;
    getCityList();
  }, [showModal]);

  useEffect(() => {
    if (!cityType[0]) return;
    getDetailCityList();
    setDetailCityType([]);
  }, [cityType]);

  useEffect(() => {
    if (!detailCityType[0]?.code) return;
    setShowModal(false);
  }, [detailCityType]);

  return (
    <>
      <EditItem
        placeholder={`지역 선택`}
        title={`지역`}
        value={detailCityType[0]?.name}
        onButtonClick={handleButtonClick}></EditItem>
      <PrevFullModal show={showModal} setShow={setShowModal}>
        <p type={`middle`}>지역 설정</p>
        <main type={`content`}>
          <Form className={`mt-3 flex flex-column gap-[16px]`}>
            <Form.Group controlId="control1">
              <Form.Label>시 선택</Form.Label>
              <Typeahead
                id={`cityType`}
                labelKey="name"
                onChange={setCityType}
                options={cityList}
                placeholder="지역을 선택하세요"
                selected={cityType}
                emptyLabel={`지역이 없습니다.`}
                inputProps={{ required: true, className: "form-select form-select-40" }}
              />
            </Form.Group>
            <Form.Group controlId="control2">
              <Form.Label>동 선택</Form.Label>
              <Typeahead
                id={`detailCityType`}
                labelKey="name"
                onChange={setDetailCityType}
                options={detailCityList}
                placeholder="지역을 선택하세요"
                selected={detailCityType}
                disabled={!detailCityList.length}
                emptyLabel={`지역이 없습니다.`}
                inputProps={{
                  required: true,
                  className: "form-select form-select-40",
                }}
              />
            </Form.Group>
          </Form>
        </main>
      </PrevFullModal>
    </>
  );
}
