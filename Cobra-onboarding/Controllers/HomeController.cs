using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Cobra_onboarding.Models;

namespace Cobra_onboarding.Controllers
{
    public class HomeController : Controller
    {
        private Entities db = new Entities();
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Order()
        {
            return View();
        }

        public ActionResult Customer()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public JsonResult CustomerList()
        {
            using (var db = new Entities())
            {
                db.Configuration.LazyLoadingEnabled = false;
                var customerList = db.People.ToList();
               
                return Json(customerList, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpPost]
        public ActionResult UpdateCustomer(CobraModel customerData)
        {
            using (var db = new Entities())
            {
                db.Configuration.LazyLoadingEnabled = false;
                var editCustomer = db.People.Find(customerData.Id);
                editCustomer.Name = customerData.Name;
                editCustomer.Address1 = customerData.Address1;
                editCustomer.Address2 = customerData.Address2;
                editCustomer.Town_City = customerData.Town_City;
                db.SaveChanges();
                return Json(new { success = true, data = editCustomer });
            }
        }

        [HttpPost]
        public ActionResult DeleteCustomer(int customerIndex)
        {
            using (var db = new Entities())
            {
                db.Configuration.LazyLoadingEnabled = false;
                var deleteCustomer = db.People.Find(customerIndex);
                db.People.Remove(deleteCustomer);
                //db.SaveChanges();
                return Json(new { success = true });
            }
        }

        [HttpPost]
        public ActionResult AddCustomer(CobraModel newCustomer)
        {
            db.Configuration.LazyLoadingEnabled = false;

            Person addCustomer = new Person
                {
                    Name = newCustomer.Name,
                    Address1 = newCustomer.Address1,
                    Address2 = newCustomer.Address2,
                    Town_City = newCustomer.Town_City
                };
                db.People.Add(addCustomer);
                //db.SaveChanges();
                return Json(new { success = true, data = addCustomer });
            
        }

        public JsonResult OrderList()
        {

            var orderList = (from oh in db.OrderHeaders
                             join od in db.OrderDetails on oh.OrderId equals od.OrderId
                             join p in db.Products on od.OrderId equals p.Id
                             join person in db.People on oh.PersonId equals person.Id
                             select new
                             {
                                 OrderId = oh.OrderId,
                                 ProductName = p.Name,
                                 Price = p.Price,
                                 Date = oh.OrderDate,
                                 PersonName = person.Name, 
                                 PersonId = person.Id,
                                 ProductId = p.Id

                             }).ToList().OrderBy(x => x.Date);

            return Json(orderList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult EditOrder(CobraModel orderData)
        {
            using (var db = new Entities())
            {
                //db.Configuration.LazyLoadingEnabled = false;
                var editOrder = db.OrderHeaders.Find(orderData.OrderId);
                editOrder.OrderDate = orderData.Date;
                editOrder.PersonId = orderData.PersonId;
                var editPName = db.People.Find(editOrder.PersonId);
                editPName.Name = orderData.PersonName;
                var editProduct = db.Products.Find(orderData.ProductId);
                editProduct.Name = orderData.ProductName;
                editProduct.Price = orderData.Price;
                    db.SaveChanges();
                    return Json(new { success = true});
            }
        }

        [HttpPost]
        public ActionResult DeleteOrder (int id)
        {
            using (var db = new Entities())
            {
                var deleteOrder = db.OrderHeaders.Find(id);
                var deleteOrderDetailId = db.OrderDetails.Where(x => x.OrderId == id).Select(p=>p.Id);
                var deleteOrderDetail = db.OrderDetails.Find(deleteOrderDetailId);

                db.OrderHeaders.Remove(deleteOrder);
                db.OrderDetails.Remove(deleteOrderDetail);

                db.SaveChanges();
                return Json(new { success = true });
            }
       }

        [HttpPost]
        public ActionResult AddOrder (CobraModel orderData)
        {
            using (var db = new Entities())
            {
                Person newPerson = new Person
                {
                    Id = orderData.PersonId,
                    Name = orderData.PersonName
                };

                // if orderData.name is not in Person db 
                if (db.People.Where(x => x.Name != orderData.Name).Any())
                {
                    db.People.Add(newPerson);
                }
                else
                {
                    var recPeople = db.People.Where(x => x.Name == newPerson.Name).FirstOrDefault();
                    newPerson.Id = recPeople.Id;
                }

                OrderHeader newOrderHeader = new OrderHeader
                {
                    OrderDate = orderData.Date,
                    PersonId = newPerson.Id
                };
                db.OrderHeaders.Add(newOrderHeader);

 
                Product newProduct = new Product
                {
                    Name = orderData.ProductName,
                    Price = orderData.Price
                };

                if (db.Products.Where(x =>x.Name != orderData.Name).Any())
                {
                    db.Products.Add(newProduct);
                }
                else
                {
                    if (db.Products.Where(x=>x.Price != orderData.Price).Any())
                    {
                        newProduct.Price = orderData.Price;
                    }

                    var recPeople = db.People.Where(x => x.Name == newPerson.Name).FirstOrDefault();
                    newPerson.Id = recPeople.Id;
                }


                OrderDetail newOrderDetail = new OrderDetail
                {
                    OrderId = newOrderHeader.OrderId,
                    ProductId = newProduct.Id
                };
                db.OrderDetails.Add(newOrderDetail);

                db.SaveChanges();
                return Json(new { success = true });
            }
        }
    }
}