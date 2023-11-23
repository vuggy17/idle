import { Button } from 'antd';
import './nomatch.css';
import { LoaderFunction, useNavigate } from 'react-router-dom';

export default function Component() {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full flex items-center justify-center">
      <section className="page_404 w-[920px]">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 ">
              <div className="col-sm-10 col-sm-offset-1  text-center">
                <div className="four_zero_four_bg">
                  <h1 className="text-center ">404</h1>
                </div>

                <div className="contant_box_404">
                  <h3 className="h2">Look like you&apos;re lost</h3>

                  <p>the page you are looking for not avaible!</p>

                  <Button type="primary" onClick={() => navigate('/')}>
                    Go to Home
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export const loader: LoaderFunction = async ({ params }) => null;
