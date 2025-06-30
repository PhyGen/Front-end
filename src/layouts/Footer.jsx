import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Copyright, Facebook, Twitter, Instagram, Linkedin, Rss } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-50 text-slate-700 py-8 mt-auto border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About PhyGen */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900">PhyGen</h3>
            <p className="text-sm leading-relaxed">
              PhyGen là nền tảng tạo đề thi trắc nghiệm Vật lý ứng dụng AI, giúp giáo viên và học sinh tiết kiệm thời gian, tối ưu hóa quá trình dạy và học.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Về chúng tôi</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Tính năng</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Liên hệ</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Câu hỏi thường gặp</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Pháp lý</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/privacy-policy" className="hover:text-blue-600 transition-colors">Chính sách bảo mật</a></li>
              <li><a href="/terms" className="hover:text-blue-600 transition-colors">Điều khoản dịch vụ</a></li>
              <li><a href="/data-deletion" className="hover:text-blue-600 transition-colors">Chính sách xóa dữ liệu</a></li>
            </ul>
          </div>
          
          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Theo dõi chúng tôi</h3>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-slate-500 hover:text-blue-600">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-500 hover:text-blue-400">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-500 hover:text-pink-500">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-500 hover:text-blue-700">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        
        <Separator className="my-8 bg-slate-200" />
        
        <div className="flex flex-col sm:flex-row items-center justify-between text-sm">
          <p className="flex items-center gap-2">
            <Copyright className="h-4 w-4" />
            <span>{new Date().getFullYear()} PhyGen. All rights reserved.</span>
          </p>
          <p className="mt-2 sm:mt-0">
            Một sản phẩm của nhóm sinh viên TDTU.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
