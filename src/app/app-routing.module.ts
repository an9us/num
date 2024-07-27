import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Hpolo011Component } from 'src/app/hpolo/hpolo011/hpolo011.component'; // 確保正確導入

const routes: Routes = [
  { path: '', component: Hpolo011Component } // 配置路由
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
